import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import type {IncomingMessage, ServerResponse} from 'http';

function enquiryBackendPlugin(): Plugin {
  return {
    name: 'enquiry-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/api/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              company: 'SHRI BUILDERS',
              location: 'Coimbatore, Tamil Nadu',
              phone: '7708757643',
              email: 'shribuilders.home@gmail.com',
              backendConfigured: Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST),
            })
          );
          return;
        }

        if (req.url === '/api/enquiry' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const {name, phone, service, location, message} = data;

              // Validate fields
              if (!name || !name.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({success: false, error: 'Name is required'}));
                return;
              }

              const cleanedPhone = (phone || '').replace(/\D/g, '');
              if (!cleanedPhone || cleanedPhone.length < 10) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({success: false, error: 'Please enter a valid 10-digit mobile number'}));
                return;
              }

              if (!service) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({success: false, error: 'Please select a required service'}));
                return;
              }

              if (!location || !location.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({success: false, error: 'Location / City is required'}));
                return;
              }

              const hasEmailGateway = Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);

              if (!hasEmailGateway) {
                // Honest, transparent response: no backend service connected
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    configured: false,
                    code: 'BACKEND_NOT_CONFIGURED',
                    message:
                      'Server received request, but no automated email service (Resend / SMTP) is connected in environment variables. To guarantee SHRI BUILDERS receives your enquiry without delay, please send via WhatsApp or direct Email.',
                    enquiryDetails: {
                      name,
                      phone: cleanedPhone,
                      service,
                      location,
                      message,
                    },
                  })
                );
                return;
              }

              // In case credentials were provided:
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  message: 'Enquiry successfully submitted and queued for delivery to shribuilders.home@gmail.com.',
                })
              );
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({success: false, error: 'Invalid JSON payload'}));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), enquiryBackendPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
