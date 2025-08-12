console.log('This client bundle only loads in the root page.')

// Each page folder can have a client.ts file in it.
// The client.ts file is treated as an entry point script for just the
// page it is associated with, but all dependencies are de-duped via
// esbuild.
