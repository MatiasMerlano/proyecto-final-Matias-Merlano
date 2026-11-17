import { Router } from 'express';

const router = Router();

function answer(message) {
  const q = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Saludos
  if (/\b(hola|buenos dias|buenas tardes|buenas noches|saludos|hey)\b/.test(q)) {
    return '¡Hola! Bienvenido a RobotCare. Me alegra que estés interesado en nuestro proyecto. Estoy aquí para explicarte cómo funcionan nuestras propuestas de asistencia, qué características tienen los robots y cómo pueden contribuir al bienestar de las personas. ¿Te gustaría conocer el Robot Básico, el Robot Avanzado o las funciones de ambos?';
  }

  // Precios
  if (/precio|cuanto cuesta|cuanto vale|costo|valor|tarifa/.test(q)) {
    return 'Actualmente, los precios de los robots todavía no están definidos, ya que RobotCare forma parte de un proyecto académico. Si deseas recibir más información, puedes comunicarte con nuestro equipo mediante el formulario de contacto de esta página o escribir al correo robotcare@gmail.com. Estaremos atentos a tus consultas.';
  }

  // Contacto
  if (/contacto|contactar|correo|email|telefono|comunicarme|comunicarse|escribirles/.test(q)) {
    return '¡Claro! Puedes comunicarte con el equipo de RobotCare a través del correo electrónico robotcare@gmail.com. También puedes utilizar el formulario de contacto disponible en nuestra página web para enviarnos tus preguntas, comentarios o solicitudes de información. Nuestro objetivo es ofrecerte orientación sobre las propuestas y características de nuestros robots.';
  }

  // Comparación entre los robots
  if (/diferencia|comparar|comparacion|cual es mejor|cual me recomiendas/.test(q)) {
    return 'RobotCare presenta dos propuestas de asistencia:\n\n🤖 Robot Básico: está orientado al apoyo en actividades cotidianas, especialmente mediante recordatorios de medicamentos y rutinas diarias.\n\n🤖 Robot Avanzado: plantea una asistencia más amplia, con funciones conceptuales de comunicación por voz, alertas y acompañamiento.\n\nLa principal diferencia está en el alcance de sus funciones. El Básico se enfoca en la asistencia esencial, mientras que el Avanzado propone herramientas adicionales de interacción y comunicación. Ambos buscan contribuir al bienestar y la autonomía de sus usuarios.';
  }

  // Robot Básico
  if (/basico|robot sencillo|robot esencial|recordatorio|medicamento|medicina|rutina diaria/.test(q)) {
    return '🤖 ROBOT BÁSICO\n\nEl Robot Básico es una propuesta de asistencia diseñada para apoyar a las personas en sus actividades cotidianas, especialmente a los adultos mayores y a quienes necesitan ayuda para mantener organizadas sus rutinas.\n\nEntre sus funciones propuestas se encuentran:\n\n• Recordatorios de medicamentos, para ayudar al usuario a recordar sus horarios.\n• Apoyo en rutinas diarias, facilitando la organización de actividades habituales.\n• Acompañamiento en el hogar, como una herramienta de apoyo en la vida cotidiana.\n\nSu propósito principal es brindar una asistencia sencilla y práctica que contribuya a la independencia y tranquilidad de las personas.';
  }

  // Robot Avanzado
  if (/avanzado|robot inteligente|voz|caida|alerta|sensor|emergencia|comunicacion|interaccion/.test(q)) {
    return '🤖 ROBOT AVANZADO\n\nEl Robot Avanzado es una propuesta que busca ofrecer herramientas de asistencia y acompañamiento con mayores posibilidades de interacción con el usuario.\n\nEntre sus características conceptuales se encuentran:\n\n• Comunicación por voz, para facilitar la interacción entre la persona y el robot.\n• Alertas, como apoyo para informar sobre situaciones que puedan necesitar atención.\n• Acompañamiento, orientado a brindar una experiencia de asistencia más cercana.\n• Funciones de apoyo y comunicación que buscan facilitar algunas actividades cotidianas.\n\nEsta propuesta pretende complementar la asistencia del Robot Básico mediante herramientas adicionales de interacción. Estas características forman parte del concepto académico de RobotCare y no deben interpretarse como funciones médicas o de emergencia ya certificadas.';
  }

  // Adultos mayores y personas con movilidad reducida
  if (/adulto|mayor|anciano|movilidad|discapacidad|dependencia|cuidador|soledad/.test(q)) {
    return 'RobotCare está pensado como una propuesta tecnológica de apoyo para adultos mayores y personas con movilidad reducida.\n\nNuestros robots buscan contribuir a su bienestar mediante herramientas como recordatorios de medicamentos, apoyo en las rutinas cotidianas, comunicación y acompañamiento.\n\nLa intención es facilitar algunas actividades del día a día, promover una mayor autonomía y brindar apoyo tanto a los usuarios como a sus familiares y cuidadores.\n\nEs importante aclarar que los robots son una propuesta complementaria: no sustituyen la atención médica, la supervisión profesional ni el cuidado humano.';
  }

  // Seguridad
  if (/seguridad|confiable|peligro|riesgo|privacidad|datos personales/.test(q)) {
    return 'La seguridad y el bienestar de los usuarios son aspectos importantes dentro del planteamiento de RobotCare.\n\nLa propuesta busca que los robots funcionen como herramientas de apoyo en el hogar, facilitando recordatorios, comunicación y acompañamiento.\n\nSin embargo, al tratarse de un proyecto académico, no afirmamos que los robots cuenten actualmente con certificaciones médicas, sistemas de emergencia verificados o garantías de seguridad comercial. Esos aspectos tendrían que desarrollarse, probarse y validarse antes de una implementación real.';
  }

  // Qué es RobotCare
  if (/que es robotcare|que significa robotcare|sobre robotcare|acerca de robotcare|que hacen|de que trata/.test(q)) {
    return '¡Bienvenido a RobotCare!\n\nRobotCare es un proyecto que plantea el uso de la tecnología y la robótica para brindar asistencia y acompañamiento a personas que pueden necesitar apoyo en sus actividades cotidianas, especialmente adultos mayores y personas con movilidad reducida.\n\nEl proyecto presenta dos propuestas principales:\n\n• Robot Básico: enfocado en recordatorios de medicamentos y apoyo en rutinas diarias.\n• Robot Avanzado: plantea funciones adicionales de comunicación por voz, alertas y acompañamiento.\n\nNuestra intención es explorar cómo la tecnología puede contribuir a mejorar la autonomía, el bienestar y la calidad de vida de las personas.';
  }

  // Funciones generales
  if (/funcion|caracteristica|beneficio|servicio|que puede hacer|para que sirve|como ayuda/.test(q)) {
    return 'RobotCare propone diferentes herramientas tecnológicas para apoyar las actividades cotidianas de sus usuarios.\n\nSus principales áreas de asistencia son:\n\n• Recordatorios: ayudar a recordar medicamentos y horarios importantes.\n• Rutinas: facilitar la organización de actividades diarias.\n• Comunicación: el Robot Avanzado plantea interacción mediante voz.\n• Alertas: propone mecanismos para informar sobre situaciones que requieren atención.\n• Acompañamiento: busca ofrecer una experiencia de asistencia más cercana.\n\nEstas funciones se distribuyen entre el Robot Básico y el Robot Avanzado. Si quieres, puedo explicarte cada robot por separado.';
  }

  // Despedidas
  if (/adios|hasta luego|chao|nos vemos|gracias/.test(q)) {
    return '¡Muchas gracias por visitar RobotCare! Esperamos que la información te haya resultado útil. Recuerda que puedes consultar sobre nuestros robots, sus funciones o nuestros medios de contacto cuando lo necesites. ¡Que tengas un excelente día!';
  }

  // Respuesta predeterminada
  return '¡Gracias por tu pregunta! Soy el asistente virtual de RobotCare y puedo ayudarte a conocer mejor nuestro proyecto.\n\nPuedo ofrecerte información sobre:\n\n• Robot Básico: recordatorios de medicamentos y apoyo en rutinas.\n• Robot Avanzado: comunicación por voz, alertas y acompañamiento.\n• Funciones y beneficios: cómo nuestras propuestas buscan ayudar en la vida cotidiana.\n• Seguridad: el propósito y las limitaciones de estas herramientas.\n• Contacto: cómo comunicarte con nuestro equipo.\n\nIntenta formular tu pregunta de otra manera o dime qué tema te interesa y con gusto te explicaré más.';
}

router.post('/', (req, res) => {
  const { message } = req.body || {};

  if (
    typeof message !== 'string' ||
    message.trim().length < 1 ||
    message.length > 500
  ) {
    return res.status(400).json({
      message: 'Escribe una pregunta de máximo 500 caracteres.'
    });
  }

  res.json({
    reply: answer(message.trim())
  });
});

export default router;