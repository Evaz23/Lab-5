"use strict";

// Imports
import { Server as SocketIO } from 'socket.io';
import express from 'express';
import { Server } from 'https';
import session from 'express-session';
import oktaPkg from '@okta/oidc-middleware';
const { ExpressOIDC } = oktaPkg;

import { Issuer } from 'openid-client';

import openidConnectPkg from 'express-openid-connect';
const { auth, requiresAuth } = openidConnectPkg;
import cons from 'consolidate';
import path from 'path';
import https from 'https';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { ServerResponse } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let app = express();
const ServerHttps=new Server(app);
const io= new SocketIO(ServerHttps);

// Globals
const OKTA_ISSUER_URI = "https://dev-d1o3zugxdpxy3l1w.us.auth0.com"
const OKTA_CLIENT_ID = "WFIeoE36hTCEO43BxsZW5ydzfYg66Uhs";
const OKTA_CLIENT_SECRET = "-mtfvowsEPqi4a34i0qczhCxzauCHf1sErWjbNb2_hSgU5nT4Wd5xORzF-xX4yyR";
const REDIRECT_URI = "https://localhost:3000/dashboard";
const PORT = process.env.PORT || "3000";
const SECRET = "hjsadfghjakshdfg87sd8f76s8d7f68s7f632342ug44gg423636346f"; // Dejar el secret así como está.

// SSL Certificate Paths (Replace with your certificate file paths)
const sslOptions = {
  key: fs.readFileSync('certs/localhost/localhost.key'),  // Path to your SSL key
  cert: fs.readFileSync('certs/localhost/localhost.crt') // Path to your SSL certificate
};

//  Esto se los dará Okta.
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: 'https://localhost:3000',
  clientID: 'WFIeoE36hTCEO43BxsZW5ydzfYg66Uhs',
  issuerBaseURL: 'https://dev-d1o3zugxdpxy3l1w.us.auth0.com'
};

let oidc = new ExpressOIDC({
  issuer: OKTA_ISSUER_URI,
  client_id: OKTA_CLIENT_ID,
  client_secret: OKTA_CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  routes: { callback: { defaultRedirect: "https://localhost:3000/dashboard" } },
  scope: 'openid profile'
});

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// MVC View Setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('models', path.join(__dirname, 'models'));
app.set('view engine', 'html');

// App middleware
app.use("/static", express.static("static"));

app.use(session({
  cookie: { httpOnly: true },
  secret: SECRET
}));

// App routes
app.use(oidc.router);

app.get("/", (req, res) => {
  res.render("index");  
});

// Middleware (requiresAuth) for protected route
app.get("/dashboard", requiresAuth(), (req, res) => {  
  var payload = Buffer.from(req.appSession.id_token.split('.')[1], 'base64').toString('utf-8');
  const userInfo = JSON.parse(payload);
  res.render("dashboard", { user: userInfo });
});

// Middleware (requiresAuth) for protected route CHAT
app.get("/chat", requiresAuth(), (req, res) => {  
  var payload = Buffer.from(req.appSession.id_token.split('.')[1], 'base64').toString('utf-8');
  const userInfo = JSON.parse(payload);
  res.render("chat", { user: userInfo });
});

Issuer.defaultHttpOptions.timeout = 20000;

// Start the server with HTTPS
oidc.on("ready", () => {
  https.createServer(sslOptions, app).listen(parseInt(PORT), () => {
    console.log("HTTPS Server running on port: " + PORT);
  });
});

// escuchar una conexion por socket
io.on('connection', function(socket){
  // si se escucha "chat message"
  socket.on('Evento-Mensaje-Server', function(msg){
    // volvemos a emitir el mismo mensaje
    io.emit('Evento-Mensaje-Server', msg);
  });
});
oidc.on("error", err => {
  console.error(err);
});



// Export the app for use in tests
export default app;