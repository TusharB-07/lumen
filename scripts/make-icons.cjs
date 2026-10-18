const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return (crc + 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createIcon(size) {
  const bg = [250, 248, 245];
  const accent = [74, 103, 65];
  const pixels = Buffer.alloc(size * size * 3);
  const setPixel = (x, y, rgb) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const idx = (y * size + x) * 3;
    pixels[idx] = rgb[0];
    pixels[idx + 1] = rgb[1];
    pixels[idx + 2] = rgb[2];
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      setPixel(x, y, bg);
    }
  }

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.32;
  const innerR = size * 0.10;
  const stroke = Math.max(2, size * 0.04);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(dist - outerR) < stroke / 2) {
        setPixel(x, y, accent);
      }
      if (dist <= innerR) {
        setPixel(x, y, accent);
      }
    }
  }

  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0);
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3;
      raw.push(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
    }
  }
  const idat = zlib.deflateSync(Buffer.from(raw));

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.writeFileSync('public/icon-192.png', createIcon(192));
fs.writeFileSync('public/icon-512.png', createIcon(512));
console.log('icons written');