import { validationModule as unalib } from '../unalib/index.js';
import assert from 'assert';

// Pruebas
describe('unalib', function() {
    // Dentro de 'unalib', vamos a probar una función específica
    describe('función is_valid_phone', function() {
   
        it('debería devolver true para 8297-8547', function() {
            // Esta es la comprobación
            assert.strictEqual(unalib.isValidPhone('8297-8547'), true);
        });
    });
});
