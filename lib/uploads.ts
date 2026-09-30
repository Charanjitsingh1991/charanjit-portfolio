import 'server-only';
import path from 'path';

export function uploadsEnabled() {
  return process.env.NODE_ENV !== 'production' || process.env.HOSTINGER_UPLOADS === 'true';
}

export function uploadsDirectory() {
  const configured = process.env.UPLOADS_DIR?.trim();
  return configured ? path.resolve(configured) : path.join(process.cwd(), process.env.LOCAL_DATA_DIR || '.data', 'uploads');
}
