/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReportHeader {
  año: string;
  periodo: string;
  fecha: string;
  direccionRegional: string;
  centroEducativo: string;
  circuito: string;
  nombreEstudiante: string;
  asignatura: string;
  nivel: string;
  nombreResponsable: string;
}

export interface ReportRow {
  id: string;
  descripcionFuncionamiento: string;
  apoyoPersonal: string[];
  apoyoPersonalOtros?: string;
  metodologia: string[];
  metodologiaOtros?: string;
  evaluacion: string[];
  evaluacionOtros?: string;
  deAcceso: string[];
  deAccesoOtros?: string;
  resultados: string;
}

export interface Report {
  id: string;
  userId?: string;
  header: ReportHeader;
  rows: ReportRow[];
  observaciones: string;
  createdAt: number;
}

export const APOYO_PERSONAL_OPTIONS = [
  "APOYO PERSONAL:",
  "El personal de orientación.",
  "Docente apoyo de educación especial.",
  "Personal en psicología educativa.",
  "Terapeuta físico.",
  "Terapeuta de lenguaje.",
  "Compañeros.",
  "Familia.",
  "Docente a cargo.",
  "Personal del área social.",
  "Personal de apoyo complementario.",
  "Personas representativas de la comunidad.",
  "Otras personas estudiantes / pares de la clase.",
  "Personas que se consideren pertinentes y oportunas.",
  "Terapeuta ocupacionales.",
  "Otros (especifique):"
];

export const METODOLOGIA_OPTIONS = [
  "APOYOS EN LA METODOLOGÍA:",
  "Entrega al estudiante en forma previa de la materia que debe estudiar en clase, de los trabajos y las tareas que debe realizar.",
  "Asignación de menos cantidad de trabajos en clase, respecto a sus compañeros.",
  "Conclusión en la casa del trabajo en clase que no logra terminar en clases.",
  "Cambio de método de lectoescritura, respecto del que utiliza el resto del grupo.",
  "Estudio de temas poco-uno a la vez-, según el ritmo del estudiante y aunque el resto de la clase avance hacia otros temas.",
  "Utilización de ayuda memoria: esquemas, símbolos, signos.",
  "Técnicas de mapas mentales, conceptuales, semánticos.",
  "Práctica de lecturas, sistematizada todos los días, por lo menos durante 15 minutos.",
  "Lectura oral, por lo menos tres veces por semana.",
  "Técnicas innovadoras para la enseñanza de las operaciones fundamentales.",
  "Procedimientos diferentes para llevar a cabo las operaciones fundamentales.",
  "Realización junto con el estudiante de resúmenes, esquemas, cuestionarios y otros.",
  "Estrategias para el procesamiento de la información.",
  "Establecimiento de una relación entre el vocabulario matemático y las representaciones icónicas.",
  "Apoyo individual al estudiante que lo necesite.",
  "Relación de los errores en la escritura con representaciones icónicas.",
  "Acceso por parte del estudiante a la materia de la lección de modo que en éste se familiarice con ésta con anticipación.",
  "Planeamiento de ejercicios para que el estudiante los vaya resolviendo.",
  "Trabajos dirigidos.",
  "Metodologías de talleres.",
  "Estrategias metacognitivas.",
  "Consecuencia de que algunas palabras tienen diferentes significados, dependiendo de las experiencias del alumno (abordaje de la polisemia).",
  "Ejercicio alternativo (diferente a la de sus compañeros).",
  "Trabajo en grupos, en parejas, en forma individual.",
  "Ejercicios, lecturas, investigaciones, tareas complementarias, mayor o menor intensidad o énfasis en un determinado aprendizaje.",
  "Asignación de trabajos diferentes para los estudiantes que presentan un ritmo de aprendizaje más lento, así como la ejecución de tareas.",
  "Procesos cognitivos para la solución de problemas.",
  "Mayor tiempo para terminar los trabajos.",
  "Aplicación de modificadores de conducta.",
  "Actividades de juego.",
  "Metodologías de trabajo cooperativo.",
  "Metodología de trabajos por proyectos.",
  "Metodología por centro de interés.",
  "Actividades curriculares adicionales para estudiantes de alta dotación o talentosos.",
  "Facilitar las fórmulas físicas o matemáticas.",
  "Hacer preguntas de repaso y control de la materia.",
  "Dividir la actividad o tarea en partes y déselas una por una.",
  "Facilitar prácticas para hacer en casa.",
  "Permitir más tiempo para terminar los trabajos individualmente.",
  "Adecuar las prácticas hechas en clase al ritmo de aprendizaje del estudiante.",
  "Utilizar un diccionario ilustrado de conceptos básicos como palabras claves y estructuras gramaticales.",
  "Modificar los aprendizajes esperados del programa según nivel de funcionamiento.",
  "Planes de trabajo individualizados (PTI).",
  "Reforzar logros, incluso pequeños avances.",
  "Incluir a padres/tutores en el proceso educativo.",
  "Coordinar con psicólogos, terapeutas del lenguaje y educadores especiales.",
  "Utilizar rúbricas y portafolios.",
  "Proporcionar múltiples formas de representación: texto, imágenes, audios, videos.",
  "Desarrollar unidades más breves y organizadas por niveles de complejidad.",
  "Ofrecer diversas formas de expresión: dibujos, mapas mentales, exposiciones orales.",
  "Usar señales visuales y horarios pictográficos.",
  "Facilitar distintos modos de compromiso: juegos, proyectos colaborativos, temas de interés personal.",
  "Incorporar pausas activas para mantener la atención.",
  "Lecturas en versión fácil o simplificada.",
  "Permitir repeticiones o revisiones de temas.",
  "Guías de trabajo con instrucciones claras y lenguaje accesible.",
  "Incorporar actividades de repaso sistemático.",
  "Fichas de refuerzo con apoyos visuales o auditivos.",
  "Uso de tutorías entre pares (compañeros tutores).",
  "Tutorías regulares para seguimiento y apoyo.",
  "Otros (especifique):"
];

export const APOYO_EVALUACION_OPTIONS = [
  "APOYOS EN LA EVALUACIÓN:",
  "Lectura de las instrucciones de las pruebas por aparte",
  "Tutor especialista",
  "Omitir la calificación de la caligrafía",
  "Cuando se tiene duda de lo escrito por el estudiante, se le solicita la respuesta de manera oral",
  "Asignación de puntaje a los pasos de un ejercicio, evaluado de este modo, el proceso y no únicamente el resultado final",
  "Asignación de más tiempo a la hora de realizar una prueba en los estudiantes que presentan un ritmo más lento en la ejecución de tareas o a los estudiantes que se dispersan fácilmente",
  "Repetición de conceptos por medio de diferentes actividades",
  "Atención individual durante la prueba",
  "Pruebas más cortas",
  "Aplicación de dos o tres pruebas cortas en vez de una, dividiendo los contenidos vistos en clase",
  "Programación de solo una prueba por día",
  "Programación de las pruebas cada dos días",
  "Ejercicios más breves, con menos pasos y situaciones por resolver",
  "Prueba de ejecución",
  "Pruebas dirigidas",
  "Aplicación de una prueba que contenga una parte escrita y otra parte oral",
  "Aclaración de dudas durante las pruebas, respecto a las instrucciones, los enunciados o las opciones",
  "Lectura oral de la prueba (apoyo personal o uso de dispositivo tecnológico) a personas estudiantes que, por su condición de discapacidad debidamente comprobada médica y pedagógicamente, así lo requieren",
  "Permitir períodos de descanso dentro o fuera del recinto de aplicación de las pruebas, con la supervisión respectiva, a personas estudiantes que por su condición física y socioemocional así lo requieren",
  "Uso de lámpara, lupa, regleta, punzón, pizarra, máquina Perkins, calculadora parlante para personas estudiantes con ceguera o baja visión",
  "Uso de las tablas de multiplicar para las personas estudiantes que así lo requieran",
  "Ubicar a la persona estudiante en un recinto que garantice la accesibilidad",
  "Prueba con diferentes opciones de tipo, tamaño de letra (fuente) y contraste",
  "Permitir que la persona estudiante repita las indicaciones después de leerlas o escucharlas",
  "Atender las consultas del estudiantado en el momento en que surjan",
  "Constatar que el estudiantado haya contestado toda la prueba; para evitar que deje preguntas en blanco",
  "En caso de que se presente esta situación, preguntarle qué pasó y darle la oportunidad de que las complete cuando se comprueba que fue por olvido",
  "El tiempo para la resolución de la prueba es de dos lecciones, en concordancia con lo establecido en el Reglamento de Evaluación de los Aprendizajes, por lo tanto, se debe garantizar que la resolución de la prueba es continua",
  "La lectura dirigida de la prueba puede facilitar al estudiantado la comprensión de lo que se solicita en cada ítem",
  "Las instrucciones generales y específicas deben se comprensibles y con un vocabulario acorde con la mediación pedagógica desarrollada",
  "Otros (especifique)"
];

export const APOYO_ACCESO_OPTIONS = [
  "APOYOS ORGANIZATIVOS:",
  "Relacionados con en el agrupamiento de las y los estudiantes, como también en la organización del tiempo y los espacios y clima organizacional del aula,",
  "Superficies antideslizantes,",
  "Ubicación del estudiante en las primeras filas,",
  "Rampas,",
  "Ubicación del estudiante al lado de un compañero tutor,",
  "Ubicación del estudiante frente a la pizarra, si tiene problemas visuales,",
  "Barandas,",
  "Puertas corredizas,",
  "Pasamanos,",
  "Ventanas más grandes,",
  "Puertas anchas,",
  "Reducción del nivel de ruido,",
  "Organizar y agrupar a los y las estudiantes de acuerdo a sus intereses motivacionales,",
  "Limpieza,",
  "Ventilación,",
  "Iluminacion natural o artificial,",
  "Decoracion con intencionalidad pedagógica,",
  "Distribucion de grupos de cuatro o dos, permitiendo el trabajo colaborativo,",
  "Distribucion del tiempo para tener al alcance los materiales,",
  "Tiempo para organizarse según la agrupacion,",
  "Tiempo de alimentacion,",
  "Tiempo para acomodarse luego de un receso,",
  "Tiempo de duración de una actividad versus cantidad de actividades,",
  "Distribución del espacio en la biblioteca,",
  "Distribución del espacio en la huerta - jardin,",
  "Distribución del espacio en el gimnasio o salon de eventos,",
  "Distribución del espacio en el laboratorio,",
  "Distribución del espacio de los lugares de la comunidad o del cantón,",
  "APOYO MATERIALES, TECNOLÓGICOS Y PRODUCTOS DE APOYO:",
  "Copias de la materia,",
  "Uso de máquinas de escribir,",
  "Tarjetas con las sílabas, con palabras,",
  "Fichas didácticas,",
  "Fotocopias con las tareas, con los ejercicios,",
  "Entrega de resúmenes, cuestionarios, esquemas, mapas conceptuales, entre otros,",
  "Computadoras,",
  "Calculadora,",
  "Diccionarios,",
  "Pizarra adicional donde el docente escribe lo que el estudiante no debe olvidar y las tareas por traer,",
  "Guías de trabajo,",
  "Material concreto,",
  "Caja de valores,",
  "Ábaco,",
  "Juego de mesas para el aprendizaje,",
  "Grabadora,",
  "Cartel con las reglas de clase,",
  "Reforzadores,",
  "TIC,",
  "Tablas de comunicación,",
  "Tijeras para zurdos,",
  "Lentes especiales,",
  "Tijeras punta redonda,",
  "Pizarra individual,",
  "Uso de resaltador,",
  "Materiales para estimulación sensorial (táctil, auditiva, visual,",
  "Materiales de apoyo en la vida cotidiana (autonomía e independencia),",
  "Lectores táctiles,",
  "Equipo de amplificador auditiva,",
  "Vibradores,",
  "Lupas,",
  "Prótesis auditivas,",
  "Máquina de escribir adaptada,",
  "Máquinas, láminas u otros materiales en relieve,",
  "Andaderas,",
  "Muletas,",
  "Sillas de rueda,",
  "Bastón,",
  "Aparatos de ortopedia,",
  "Cuadernos con reglones anchos,",
  "Textos en braille,",
  "Calculadora parlante,",
  "Regleta y punzón,",
  "Máquina perkins,",
  "Impresora Brailler,",
  "Fotocopias ampliadas,",
  "Materiales concretos que los estudiantes puedan manipular,",
  "Lápices de carpintero, crayolas, tizas gruesas,",
  "Superficie con texturas,",
  "Lápices triangulares,",
  "Historias sociales,",
  "Bloques de construccion,",
  "Láminas,",
  "Reloj,",
  "Dispositivos moviles,",
  "Televisor,",
  "Radiograbadores,",
  "Plataforma de aprendizaje en linea,",
  "Pizarra digital,",
  "Realidad virtual o aumentada,",
  "Lector de pantalla,",
  "Teclado virtual,",
  "Lector ocular,",
  "Tableros de comunicación,",
  "Pulsores,",
  "Audifonos,",
  "Controles postulares,",
  "Otros (especifique):"
];
