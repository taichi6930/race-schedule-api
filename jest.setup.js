// jest setup file (復元用)
// Set ENV for tests
process.env.ENV = process.env.ENV || 'TEST';
// Ensure reflect-metadata is loaded for libraries like tsyringe
require('reflect-metadata');
