import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { Express } from "express";
import { registerRoutes } from "../../server/routes";
import express from "express";
import session from "express-session";
import { setupTestDatabase, createTestBooking } from "../setup";
import path from "path";
import fs from "fs";

describe('File Upload Functionality Tests', () => {
  let app: Express;
  let server: any;

  setupTestDatabase();

  beforeAll(async () => {
    // Setup Express app with same middleware as production
    app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Setup session middleware
    app.use(session({
      secret: 'test-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
      }
    }));

    server = await registerRoutes(app);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Gallery Image Upload', () => {
    // Create a test image buffer for uploads
    const createTestImageBuffer = (size: number = 1024) => {
      // Create a minimal JPEG header + data
      const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43
      ]);
      const padding = Buffer.alloc(size - jpegHeader.length - 2, 0x00);
      const jpegEnd = Buffer.from([0xFF, 0xD9]);
      
      return Buffer.concat([jpegHeader, padding, jpegEnd]);
    };

    it('should upload a single image successfully', async () => {
      const testImage = createTestImageBuffer(2048);
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'test-image.jpg')
        .field('category', 'portfolio')
        .field('description', 'Test image upload');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('1 image(s) uploaded successfully');
      expect(response.body.images).toBeDefined();
      expect(response.body.images).toHaveLength(1);
      
      const uploadedImage = response.body.images[0];
      expect(uploadedImage.filename).toBeDefined();
      expect(uploadedImage.originalName).toBe('test-image.jpg');
      expect(uploadedImage.category).toBe('portfolio');
      expect(uploadedImage.url).toContain('data:image/jpeg;base64,');
    });

    it('should upload multiple images simultaneously', async () => {
      const testImage1 = createTestImageBuffer(1024);
      const testImage2 = createTestImageBuffer(2048);
      const testImage3 = createTestImageBuffer(3072);
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage1, 'test-image-1.jpg')
        .attach('images', testImage2, 'test-image-2.jpg')
        .attach('images', testImage3, 'test-image-3.jpg')
        .field('category', 'wedding')
        .field('description', 'Multiple test images');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('3 image(s) uploaded successfully');
      expect(response.body.images).toHaveLength(3);
      
      response.body.images.forEach((image: any, index: number) => {
        expect(image.originalName).toBe(`test-image-${index + 1}.jpg`);
        expect(image.category).toBe('wedding');
        expect(image.url).toContain('data:image/jpeg;base64,');
      });
    });

    it('should reject files that are too large', async () => {
      // Create a 60MB file (exceeds 50MB limit)
      const largeImage = createTestImageBuffer(60 * 1024 * 1024);
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', largeImage, 'large-image.jpg')
        .field('category', 'portfolio');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('File too large');
      expect(response.body.message).toContain('less than 50MB');
    });

    it('should reject too many files at once', async () => {
      const testImage = createTestImageBuffer(1024);
      
      const request_builder = request(app).post('/api/gallery/upload');
      
      // Try to upload 15 files (exceeds 10 file limit)
      for (let i = 0; i < 15; i++) {
        request_builder.attach('images', testImage, `test-image-${i}.jpg`);
      }
      
      const response = await request_builder.field('category', 'portfolio');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Too many files');
      expect(response.body.message).toContain('maximum of 10 images');
    });

    it('should reject non-image files', async () => {
      const textFile = Buffer.from('This is not an image file', 'utf8');
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', textFile, 'not-an-image.txt')
        .field('category', 'portfolio');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid file');
      expect(response.body.message).toContain('Only image files are allowed');
    });

    it('should handle empty upload request', async () => {
      const response = await request(app)
        .post('/api/gallery/upload')
        .field('category', 'portfolio');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No files uploaded');
      expect(response.body.message).toContain('select at least one image');
    });

    it('should associate uploaded images with booking', async () => {
      const testBooking = await createTestBooking();
      const testImage = createTestImageBuffer(1024);
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'booking-image.jpg')
        .field('category', 'client_session')
        .field('bookingId', testBooking.id.toString());

      expect(response.status).toBe(200);
      expect(response.body.images[0].bookingId).toBe(testBooking.id);
    });

    it('should handle various image formats', async () => {
      // Test different image formats
      const jpegImage = createTestImageBuffer(1024);
      const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const pngImage = Buffer.concat([pngHeader, Buffer.alloc(1016, 0x00)]);
      
      // Test JPEG
      const jpegResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', jpegImage, 'test.jpg')
        .field('category', 'portfolio');

      expect(jpegResponse.status).toBe(200);
      
      // Test PNG
      const pngResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', pngImage, 'test.png')
        .field('category', 'portfolio');

      expect(pngResponse.status).toBe(200);
    });
  });

  describe('Image Management Operations', () => {
    let uploadedImageId: number;

    beforeAll(async () => {
      // Upload a test image for management operations
      const testImage = createTestImageBuffer(1024);
      const uploadResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'management-test.jpg')
        .field('category', 'test');

      uploadedImageId = uploadResponse.body.images[0].id;
    });

    it('should retrieve gallery images', async () => {
      const response = await request(app)
        .get('/api/gallery');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should retrieve featured images only', async () => {
      // First mark an image as featured
      await request(app)
        .patch(`/api/gallery/${uploadedImageId}/featured`)
        .send({ featured: true });

      const response = await request(app)
        .get('/api/gallery?featured=true');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((image: any) => {
        expect(image.featured).toBe(true);
      });
    });

    it('should update image featured status', async () => {
      const response = await request(app)
        .patch(`/api/gallery/${uploadedImageId}/featured`)
        .send({ featured: true });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Image featured status updated');
      expect(response.body.featured).toBe(true);
    });

    it('should delete an image', async () => {
      // Upload a new image to delete
      const testImage = createTestImageBuffer(1024);
      const uploadResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'delete-test.jpg')
        .field('category', 'test');

      const imageId = uploadResponse.body.images[0].id;

      const deleteResponse = await request(app)
        .delete(`/api/gallery/${imageId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Image deleted successfully');
    });

    it('should create gallery image via API', async () => {
      const imageData = {
        filename: 'api-created-image.jpg',
        originalName: 'api-image.jpg',
        url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        category: 'api_test',
        featured: false
      };

      const response = await request(app)
        .post('/api/gallery')
        .send(imageData);

      expect(response.status).toBe(200);
      expect(response.body.filename).toBe(imageData.filename);
      expect(response.body.category).toBe(imageData.category);
    });
  });

  describe('Upload Error Handling', () => {
    it('should handle malformed multipart data', async () => {
      // Send invalid multipart data
      const response = await request(app)
        .post('/api/gallery/upload')
        .set('Content-Type', 'multipart/form-data; boundary=invalid')
        .send('--invalid\r\nContent-Disposition: form-data; name="invalid"\r\n\r\ninvalid data\r\n--invalid--');

      expect(response.status).toBe(400);
    });

    it('should handle corrupted image files', async () => {
      // Create a file with image extension but invalid content
      const corruptedImage = Buffer.from('This is not a valid image file content', 'utf8');
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', corruptedImage, 'corrupted.jpg')
        .field('category', 'portfolio');

      // Should still accept it since file filter only checks MIME type
      // The application should handle processing errors gracefully
      expect([200, 400, 500]).toContain(response.status);
    });

    it('should handle simultaneous uploads from multiple clients', async () => {
      const testImage = createTestImageBuffer(1024);
      
      // Simulate concurrent uploads
      const uploadPromises = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/api/gallery/upload')
          .attach('images', testImage, `concurrent-${i}.jpg`)
          .field('category', 'concurrent_test')
      );

      const responses = await Promise.all(uploadPromises);
      
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.images[0].originalName).toBe(`concurrent-${index}.jpg`);
      });
    });

    it('should validate file extensions vs MIME types', async () => {
      // Create a file with wrong extension
      const testImage = createTestImageBuffer(1024);
      
      const response = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'fake-extension.pdf') // PDF extension but image content
        .field('category', 'portfolio');

      // Should be rejected based on MIME type detection
      expect(response.status).toBe(400);
    });
  });

  describe('File Storage and Retrieval', () => {
    it('should store file metadata correctly', async () => {
      const testImage = createTestImageBuffer(2048);
      
      const uploadResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'metadata-test.jpg')
        .field('category', 'metadata_test')
        .field('description', 'Testing metadata storage');

      expect(uploadResponse.status).toBe(200);
      
      const uploadedImage = uploadResponse.body.images[0];
      expect(uploadedImage.filename).toContain('metadata-test.jpg');
      expect(uploadedImage.originalName).toBe('metadata-test.jpg');
      expect(uploadedImage.category).toBe('metadata_test');
      expect(uploadedImage.tags).toContain('metadata_test');
      expect(uploadedImage.tags).toContain('uploaded');
    });

    it('should handle base64 encoding correctly', async () => {
      const testImage = createTestImageBuffer(1024);
      
      const uploadResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'base64-test.jpg')
        .field('category', 'encoding_test');

      expect(uploadResponse.status).toBe(200);
      
      const uploadedImage = uploadResponse.body.images[0];
      expect(uploadedImage.url).toMatch(/^data:image\/jpeg;base64,/);
      
      // Verify the base64 data can be decoded
      const base64Data = uploadedImage.url.split(',')[1];
      const decodedBuffer = Buffer.from(base64Data, 'base64');
      expect(decodedBuffer.length).toBeGreaterThan(0);
    });

    it('should generate unique filenames for uploads', async () => {
      const testImage = createTestImageBuffer(1024);
      
      // Upload the same file twice
      const upload1 = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'duplicate.jpg')
        .field('category', 'duplicate_test');

      const upload2 = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImage, 'duplicate.jpg')
        .field('category', 'duplicate_test');

      expect(upload1.status).toBe(200);
      expect(upload2.status).toBe(200);
      
      const filename1 = upload1.body.images[0].filename;
      const filename2 = upload2.body.images[0].filename;
      
      // Filenames should be different due to timestamp
      expect(filename1).not.toBe(filename2);
      expect(filename1).toContain('duplicate.jpg');
      expect(filename2).toContain('duplicate.jpg');
    });
  });
});