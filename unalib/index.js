export const validationModule = {

  // lógica que valida si un teléfono es correcto
  isValidPhone: (phone) => {
    // inicialización lazy
    let isValid = false;
    // expresión regular para validar el teléfono
    const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;

    // validación Regex
    try {
      isValid = re.test(phone);
    } catch (e) {
      console.error(e);
    } finally {
      return isValid;
    }
  },

  // lógica que valida el mensaje
  validateMessage: (msg) => {
    let obj;
    
    try {
      obj = JSON.parse(msg);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return null;
    }

    if (validationModule.isValidPhone(obj.mensaje)) {
      console.log("Es un teléfono!");
      obj.mensaje = validationModule.getEmbeddedCode(obj.mensaje);
    } else {
      console.log("Es un texto!");
    }

    return JSON.stringify(obj);
  },

  // lógica adicional para obtener código embebido (placeholder para la función real)
  getEmbeddedCode: (message) => {
    // Aquí iría la lógica para obtener el código embebido a partir del teléfono
    return `Embed: ${message}`;
  }

  // fin del módulo
};