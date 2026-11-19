import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

dotenv.config();

describe('Production CI Verification', () => {
  let server;

  it('connects to MongoDB and responds 200 on /api/health', async () => {
    await connectDB();

    await new Promise((resolve) => {
      server = app.listen(0, resolve); // Picks an open port automatically
    });

    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.status, 'OK');
  });

  after(async () => {
    if (server) server.close();
    await mongoose.connection.close();
  });
});
