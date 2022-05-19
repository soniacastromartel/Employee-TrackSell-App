/* eslint-disable max-len */
/**
 * RECURSOS
 */
export const CABECERA_LOGIN = 'assets/imgs/cabecera.png';
export const LOGO_PATH = 'assets/imgs/logo.png';
export const FAQ = 'assets/imgs/faq.png';
export const BIENVENIDA = 'assets/imgs/planincent.png';
export const NO_CONNECTION_IMG = 'assets/imgs/no-connection.gif';
export const IC_ARROW_UP = 'arrow-up-circle';
export const IC_ARROW_DOWN = 'arrow-down-circle';
// export const BASE_URL = 'https://pdi.grupoicot.es:8000/';
// export const BASE_URL = 'https://pdipre.grupoicot.es:8000/';
export const BASE_URL = 'https://localhost:8000/';
export const BASE_UPDATE_LINK = 'storage/versiones/';
export const BASE_UPATE_IOS_PWA_LINK = 'storage/versiones/ios/latest/';
export const ANDROID_ENVIRONMENT_FILE_PATH = 'files/';
export const IOS_ENVIRONMENT_FILEDIR_PATH = 'Library/';
export const ENVIRONMENT_FILENAME = 'environment.txt';
export const LINK_PRIVACY = BASE_URL + 'storage/condiciones/POLITICA-PRIVACIDAD-ICOT-PDI-APP.pdf';

/**
* NAME ROUTER
*/
export const HOME = 'home';
export const DASHBOARD = 'dashboard';
export const LOGIN_APP = 'api/login';
export const NEW_ACCESS = 'api/register';
export const CHANGING_PASS = 'api/changingPass';
export const USER_RECOVERY_PASS = 'api/recoveryPass';
export const CENTER_EMPLOYEE = 'api/employee_info/';
export const CENTERS_LIST = 'api/getCenters';
export const CATEGORIES_LIST = 'api/employee_categories/';
export const INCENTIVES_EMPLOYEE = 'api/incentives';
export const SEARCH_TRACKING = 'api/tracking/search';
export const SERVICES_OF_CENTER = 'api/services/';
export const SELLING_SERVICES = 'api/tracking/create';
export const RANKINGS_OF_EMPLOYEES = 'api/employee_ranking';
export const CLASIFICATION_LEAGUE = 'api/getClasification'
export const ERROR_APP = 'api/save_errors';
export const ACCESS_COUNT = 'api/controlUser';
export const CHECKING_VERSION = 'api/checkingVersion';
export const GET_VERSION = 'api/getLastVersion';
export const CHECK_NOT_UPDATE = 'api/notUpdate';
export const RESET_COUNT_UPDATE = 'api/resetCountUpdate';
export const DATA_PROMO = 'api/promotions';
export const QUESTIONS_FAQ = 'api/getDataFAQ';
export const LAST_CHANGES = 'api/getLastChanges';
export const UPDATING_VERSION = 'api/updateVersion';
export const AVAILABLES_DISCOUNTS = 'api/discounts/';
export const APP_LOGS = 'api/logs';
export const UNLOCK_REQUEST= 'api/unlockRequest';

/**
* KEY WORDS
*/
export const DISPLAY_BLOCK = 'block';
export const NONE = 'none';
export const NAME = 'name';
export const DNI = 'dni';
export const CENTRE = 'center';
export const USERNAME = 'username';
export const PASSWORD = 'password';
export const ROUTE_CONTROL_ACCESS = 'routeAccess';
export const PRIVACY_WORD = 'privacy';
export const UNLOCK_REQUESTED = 'unlockRequest';
export const PHONE = 'phone';
export const HC = 'hc';
export const EURO_DIGIT = ' €';
export const EXTRA_DATA = 'extra';
export const REPEAT_SERVICE = 'repeat';
export const IMG_WORD = 'img';
export const PERSON_ICON = 'person';
export const CLOSE_ICON = 'close';
export const SECRET = 'InformaticTeam';
export const EXTRA_CATEGORY = 'Otros';
export const LOGO_WORD = 'logo';
export const VERSION_APP = 'version ';
export const RADIO_LABEL_EN_CURSO = 'CORTE ACTUAL';
export const RADIO_LABEL_MESYEAR = 'MES Y AÑO';
export const RADIO_LABEL_YEAR = 'AÑO';
export const ACTUAL_DATE = 'actual';
export const MONTH_YEAR = 'monthYear';
export const YEAR = 'year';
export const MONTH = 'month';
export const FORMAT_DATE_SPANISH = 'DD-MMMM-YYYY';
export const FORMAT_DATE_SPANISH_SHORT = 'DD-MM-YYYY';
export const DAY_MONTH_YEAR_FORMAT = 'YYYY-MM-DD';
export const MONTH_YEAR_FORMAT = 'MMMM YYYY';
export const YEAR_FORMAT = 'YYYY';
export const RADIO_LIST_ID = 'radio_list';
export const TYPE_RANKING_CENTRO = 'centro';
export const TYPE_RANKING_GRUPO = 'grupo';
export const MIN_VERSION_APP = '0.0.1';
export const SUGERENCIAS = 'Sugerencias';
export const RESUMEN_INCENTIVOS = 'RESUMEN';
export const VENTA_FORM_ID = 'forSale';
export const DEV_WORD_CREATE_FILE_ENVIRONMENT = 'dev';
export const QUERY_COUNT_ACCESS = '?';
export const SUM_ACCESS = '1';
export const CORDOVA_PLATFORM = 'cordova';
export const ANDROID_TYPE = 'android';
export const IOS_TYPE = 'ios';
export const MAIL_TO = 'mailto:';
export const CC_MAIL = '?cc=';
export const SUBJECT_MAIL = '&subject=';
export const UPDATE_VALID = 'update';
export const DOWNLOAD_VALID = 'download';
export const DEFAULT_SCREEN_MODE = 'portrait';
export const SCREEN_MODE_LEAGUE = 'landscape';
export const IMG_FIELD = 'image_portrait';

/**
* ICONS
*/
export const BASE_ICON_ALERT = 'alert-circle';
export const ACTION_OK_IC = 'checkbox';
export const TIME_OUT_RESPONSE_IC = 'hourglass';
export const NO_VALID_IC = 'ban';
export const WARNING_IC = 'warning';

/**
* PATTERN
*/
export const PATTERN_PHONE = '[0-9]{9}';
export const PASS_FORMAT = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$€+-=<>_.#?!@$%^`&*-]).{8,}$';

/**
* RESPONSES BACK-END
*/
export const EMPTY_STRING = '';
export const CANCEL_OPTION = 'cancel';
export const RESPONSE_NO_VALID = 'no_valid';
export const RESPONSE_PENDING_VALIDATION = 'pending_validation';
export const RESPONSE_PENDING_CHANGE_PASSWORD = 'pending_change_pass';
export const RESPONSE_INVALID_CREDENTIALS = 'Invalid Credentials';
export const RESPONSE_OK_RESULT = 'ok';
export const RESPONSE_REGISTERED = 'registered_user';
export const RESPONSE_LOGIN_SUCCESFULL = 'Usuario logueado!!';
export const RESPONSE_REQUESTED = 'requested';
export const RESPONSE_INVALID_SECRET = '_invalid';
export const RESPONSE_HACK = 'hack_denied';
export const RESPONSE_BLOCK_ACCOUNT = 'block';
export const NO_VALIDATION_FORM = 'Validation Error.';
export const CENTER_REQUIRED_RESPONSE = 'The centre employee id field is required.';
export const CENTRE_NO_ACTIVE = 'Error no hay definido objetivo';

/**
* STRING RESOURCES
*/
export const SPANISH_MONTHS_VALUES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
export const LABELS_FOR_SELECT_INCENTIVES = ['CORTE ACTUAL', 'POR AÑO', 'POR MES Y AÑO'];
export const DATA_LABELS = ['USUARIO: ', 'TELÉFONO:', 'CATEGORÍA:', 'EMAIL:'];
export const IDENTIFICATION_LABELS = ['HISTORIAL CLÍNICO', 'TELÉFONO', 'DNI'];
export const CONTENT_LABELS = ['TOTAL SERVICIOS RECOMENDADOS:', 'INCENTIVOS ACUMULADOS:'];
export const INFO_ACEPTACION_PACIENTE = 'CONFIRMO QUE HE INFORMADO AL PACIENTE DEL PROCESO DE CONFIRMACIÓN Y DE LA ACEPTACIÓN DE LOS TÉRMINOS Y DEL SERVICIO';
export const CONECTING = 'CONECTANDO,<br><br>POR FAVOR ESPERE';
export const COLLECTING_INFO = 'RECOPILANDO DATOS,<br>POR FAVOR ESPERE';
export const UPDATING = 'ACTUALIZANDO,<br>POR FAVOR ESPERE';
export const LOADING_CONTENT = 'CARGANDO,<br><br>POR FAVOR ESPERE';
export const LOADING_CENTERS = 'CARGANDO CENTROS,<br>POR FAVOR ESPERE';
export const LOADING_DATA = 'CARGANDO CONTENIDO,<br>POR FAVOR ESPERE';
export const NOT_DISCOUNT = 'NO SE APLICA';
export const LOADING_SERVICES = 'CARGANDO SERVICIOS<br>POR FAVOR ESPERE';
export const LOADING_RANKING = 'CARGANDO RANKINGS<br>POR FAVOR ESPERE';
export const CONTACT_SUPERVISOR = 'Contacto con supervisor';
export const RETRY_SEND_REQUEST = 'REENVIAR SOLICITUD';
export const CONFIRM_USERNAME = 'POR FAVOR CONFIRME SU NOMBRE DE USUARIO';
export const INSERT_USERNAME = 'INTRODUZCA EL USUARIO ASOCIADO A SU CUENTA';
export const PLACEHOLDER_USERNAME = 'Su usuario aquí';
export const ERROR_TRACKING_DATE = 'The tracking date must be a date before tomorrow.';
export const ERROR_CORTE_INCENTIVES = 'FECHA FUERA DE PERIODO DE CORTE, CORREGIR POR FAVOR';
export const SEND_SUGGESTIONS = '¡ENVÍANOS TUS SUGERENCIAS!';
export const TITLE_UPDATE = '¡NUEVA VERSIÓN DISPONIBLE!';
export const INFO_UPDATE = '<img src="assets/imgs/update.png"></img><br><br><ion-note>SE ENCUENTRA DISPONIBLE UNA NUEVA VERSIÓN ESTABLE, POR FAVOR PULSE EL BOTÓN </ion-note><ion-label class="enlace">DESCARGAR</ion-label><ion-note> PARA PROCEDER A LA ACTUALIZACIÓN</ion-note>';
export const UPDATE_NOT_ALLOW = 'CONEXIÓN WIFI REQUERIDA';
export const INFO_WIFI_REQUIRED_UPDATE = '<ion-icon name="warning"></ion-icon><br><br><ion-note>DISPONIBLE VERSIÓN ESTABLE PERO SU DISPOSITIVO ESTÁ CONECTADO A LA RED CON DATOS MÓVILES, RECOMENDAMOS CONEXIÓN WIFI PARA REALIZAR LA DESCARGA Y LA ACTUALIZACIÓN</ion-note><br><br><ion-note class=\'notUpdate\'>ACTUALIZACIÓN DISPONIBLE DESDE LA SECCIÓN DE PREGUNTAS FRECUENTES</ion-note></br>';
export const NO_DATA_FOUND = 'NO HAY DATOS QUE MOSTRAR PARA EL RANGO DE FECHAS SELECCIONADO';
export const NO_DATA_FAQ = 'NO SE PUEDEN MOSTRAR DATOS ACTUALMENTE, POR FAVOR INTÉNTELO DE NUEVO MÁS TARDE';
export const CHANGE_LIST = 'LISTA DE CAMBIOS';
export const USER_VALIDADO = 'User validated no es -1.';
export const BAD_OPERATION = 'ALGO SALIÓ MAL.. :(';
export const CORTE_FROM = 'DESDE EL 21 DE ';
export const CORTE_TO = ' AL 20 DE ';
export const INFO_MODEL = 'MODEL: ';
export const INFO_UUID = ', UUID: ';
export const INFO_VERSION = ', VERSION: ';
export const INFO_MANUFACTURE = ', FABRICANTE: ';
export const INFO_SYSTEM = ', SISTEMA: ';
export const ENCRIPTING_KEY= 'secretKey';

/** 
* LOGS MESSAGES & TYPES
*/
export const LOG_TYPE = ['Info', 'Warning', 'Error'];
export const LOG_PLACE = ['Loggin', 'Recuperación Contraseña', 'Solicitud Acceso'];

/**
* MESSAGES NOTIFICATIONS
*/
export const ERROR_DOWNLOAD_UPDATE = 'ERROR DE DESCARGA';
export const ERROR_CANCEL_UPDATE = 'java.net.SocketException: Socket closed';
export const ERROR_RECONFIGURE_SALE = 'ERROR AL CARGAR EL SERVICIO';

export const SUGGESTIONS_TEXT = {
  title: '¿ENVIAR SUGERENCIA?',
  msg: '¿DESEA ENVIAR UNA SUGERENCIA?<br><br>(SE ABRIRÁ LA APLICACIÓN PARA ENVIAR CORREOS)'
};

export const ACTION_PROMO_SERVICES = {
  title: '¿RECOMENDAR SERVICIO?',
  msg: '¿DESEA RECOMENDAR EL SERVICIO DE '
};

export const EMPLOYEE_NO_FOUND = {
  title: 'USUARIO NO ENCONTRADO',
  msg: 'USUARIO NO ENCONTRADO EN EL SISTEMA<br><br>SI SE HA REGISTRADO ANTERIORMENTE POR FAVOR ESPERE QUE FINALICE EL PROCESO DE ACTIVACIÓN, EN CASO CONTRARIO POR FAVOR REGÍSTRESE PARA ACCEDER.'
};

export const INVALID_CREDENTIALS = {
  title: 'CREDENCIALES INCORRECTOS',
  msg: 'LOS CREDENCIALES INTRODUCIDOS NO SON CORRECTOS.<br><br>REVISE LOS DATOS POR FAVOR'
};

export const CREDENTIALS_FORMAT_ERROR = {
  title: 'LOS CREDENCIALES NO SIGUEN EL FORMATO ADECUADO',
  msg: 'LA CONTRASEÑA DEBE CONTENER AL MENOS 1 CARACTER EN MAYÚSCULA, 1 NÚMERO, 1 CARACTER ESPECIAL Y DEBE SER IGUAL O MAYOR A 8 CARACTERES'
};

export const CREDENTIALS_NOT_SAME = {
  title: 'LOS CREDENCIALES DEBEN SER IDÉNTICOS',
  msg: 'POR FAVOR REVISE LOS DATOS INTRODUCIDOS'
};

export const CREDENTIALS_EMPTY = {
  title: 'LOS CREDENCIALES NO PUEDEN QUEDAR EN BLANCO',
  msg: 'POR FAVOR REVISE LOS DATOS INTRODUCIDOS'
};

export const EMPLOYEE_PENDING_VALIDATION = {
  title: 'USUARIO PENDIENTE DE VALIDACIÓN',
  msg: 'EL PROCESO DE VALIDACIÓN SE ENCUENTRA ACTIVO, POR FAVOR ESPERE A QUE FINALICE<br><br>GRACIAS POR SU PACIENCIA.'
};

export const NEW_REQUEST_ACCESS = {
  title: 'SOLICITUD DE ACCESO EN CURSO',
  msg: 'SE ENCUENTRA ACTIVA UNA SOLICITUD...<br><br>¿DESEA CANCELAR Y ENVIAR UNA NUEVA SOLICITUD?'
};

export const REQUEST_ACCESS = {
  title: '¡SOLICITUD DE ACCESO ENVIADA!',
  msg: 'SU SOLICITUD DE ACCESO SE ENVIÓ CORRECTAMENTE, POR FAVOR ESPERE ACTIVACIÓN PARA ACCEDER.'
};

export const SEND_CHANGE_REQUEST = {
  title: 'SOLICITUD ENVIADA',
  msg: 'SOLICITUD ENVIADA CORRECTAMENTE'
};

export const RESET_FORM_SALE = {
  title: '¿REESTABLECER FORMULARIO?',
  msg: '¿DESEA VACIAR LOS CAMPOS DEL FORMULARIO?'
};

export const INIT_SESION_REQUIRED = {
  title: 'INICIO PREVIO NECESARIO',
  msg: 'AÚN NO TE CONOCEMOS, ES NECESARIO INICIAR SESIÓN AL MENOS UNA VEZ'
};

export const NOT_FOUND = {
  title: 'CUENTA NO ENCONTRADA',
  msg: 'LA CUENTA SOLICITADA NO SE ENCUENTRA EN EL SISTEMA'
};

export const REQUEST_CHANGING_PASS = {
  title: 'SOLICITUD ENVIADA',
  msg: 'Su solicitud de cambio de contraseña ha sido enviada correctamente'
};

export const DENIED_ACTION = {
  title: 'IMPOSIBLE REALIZAR OPERACIÓN',
  msg: 'LOS DATOS NO COINCIDEN, (Consulte con su Supervisor)'
};

export const PASSWORD_CHANGED = {
  title: 'CONTRASEÑA CAMBIADA',
  msg: 'CONTRASEÑA ACTUALIZADA CORRECTAMENTE'
};

export const INCORRECT_SECRET_WORD = {
  title: 'ACCESO DENEGADO',
  msg: 'SOLICITUD DENEGADA, CONSULTE CON EL ADMINISTRADOR POR FAVOR'
};

export const USER_EXIST_SYSTEM = {
  title: 'EL USUARIO YA EXISTE',
  msg: 'LOS DATOS APORTADOS ESTÁN INCLUIDOS EN EL SISTEMA, POR FAVOR INICIE SESIÓN EN LUGAR DE SOLICITAR UN NUEVO ACCESO'
};

export const SEND_MAIL = {
  title: 'CONTACTO CON SUPERVISOR',
  msg: '¿DESEA ENVIAR UN MAIL AL SUPERVISOR DE SU CENTRO?'
};

export const SUCCESSFUL = {
  title: 'OPERACIÓN REALIZADA',
  msg: 'OPERACIÓN REALIZADA CORRECTAMENTE'
};

export const PRE_REGISTER_SUCCESSFULL = {
  title: 'SOLICITUD YA ENVIADA',
  msg: 'POR FAVOR ESPERE ACTIVACIÓN'
};

export const PRE_REGISTER_LOST = {
  title: 'YA DISPONE DE ACCESO',
  msg: 'SI NECESITA RESETEAR SU CONTRASEÑA SELECCIONE LA OPCIÓN <br><br><ion-note class="especial">¿CONTRASEÑA OLVIDADA?</ion-note>'
};

export const BLOCK_ACCOUNT = {
  title: '¡CUENTA BLOQUEADA!',
  msg: 'SU CUENTA SE ENCUENTRA BLOQUEADA, POR FAVOR SOLICITE DESBLOQUEO'
};

export const REQUEST_IN_PROCESS = {
  title: 'SOLICITUD EN CURSO',
  msg: 'SU SOLICITUD ESTÁ SIENDO PROCESADA, GRACIAS'
};

export const IMCOMPLETE_DATA = {
  title: 'OPERACIÓN NO REALIZADA',
  msg: 'FALTAN DATOS O SON INCORRECTOS'
};

export const TIME_OUT = {
  title: 'EL SERVIDOR NO RESPONSE',
  msg: 'IMPOSIBLE CONECTAR EN ESTOS MOMENTOS, INTENTELO DE NUEVO PASADO UNOS MINUTOS'
}

export const VENTA_CONFIRMADA = {
  title: 'OPERACIÓN REALIZADA CORRECTAMENTE',
  msg: 'Registro de venta confirmado'
};

export const POLICY_PRIVACY = {
  title: 'POLÍTICA DE PRIVACIDAD',
  // msg: 'Para el óptimo funcionamiento de esta app, es necesario recoger y procesar cierta información obtenida del dispositivo en el que se ha instalado.<br>Estos, ni ningún otro dato podrán ser cedidos a terceros y solo serán utilizados con los siguientes fines:<br>1- Seguridad<br>2- Mejoras de la aplicación<br>3- Resolución de problemas<br><br><a href="' + LINK_PRIVACY + '">POLÍTICA DE PRIVACIDAD</a>',
  msg: 'La descarga de esta aplicación es voluntaria e implica la aceptación de las condiciones de privacidad.\nAsimismo, para su funcionamiento se recogerá y procesará cierta información obtenida del dispositivo donde se instala.\n\n<a href="' + LINK_PRIVACY + '">POLÍTICA DE PRIVACIDAD</a>',
  extra: 'Última revisión (14 de julio de 2021)'
};

export const SESION_EXPIRED = {
  title: '¡SESIÓN DE USUARIO EXPIRADA!',
  msg: 'SU SESIÓN EXPIRÓ, POR FAVOR INICIE SESIÓN PARA CONTINUAR'
};

export const NO_CONNECTION = {
  title: 'SIN CONEXIÓN A INTERNET',
  subtitle: 'SE NECESITA UNA CONEXIÓN DE RED',
  msg: 'POR FAVOR CONECTE A UNA RED PARA CONTINUAR',
  ic: NO_CONNECTION_IMG
};

export const EXIT_FORM_SALE = {
  title: '¿SALIR DEL FORMULARIO?',
  msg: '¿DESEA CERRAR EL FORMULARIO DE VENTA?'
};

export const SERVER_NO_AVAILABLE = {
  title: 'SERVIDOR NO DISPONIBLE',
  msg: 'EL SERVIDOR NO RESPONDE, POR FAVOR INTÉNTELO DE NUEVO MÁS TARDE'
};

/** ERROR MESSAGE **/


export const YA_VALIDADO = {
  title: '¡USUARIO YA VALIDADO!',
  msg: 'OPERACIÓN INCORRECTA, EL USUARIO INTRODUCIDO YA ESTÁ VALIDADO'
};

export const ERROR = {
  title: '¡ERROR OCURRIDO!',
  msg: 'ERROR DESCONOCIDO, INTÉNTELO DE NUEVO POR FAVOR'
};

export const EXIT_ERROR = {
  title: '¡ERROR OCURRIDO!',
  msg: 'ERROR OCURRIDO SALIENDO DE LA APP, INTÉNTELO DE NUEVO POR FAVOR'
};

export const SALE_ERROR = {
  title: '¡OPERACIÓN NO REALIZADA!',
  msg: 'ERROR OCURRIDO AL REGISTRAR LA VENTA, INTÉNTELO DE NUEVO POR FAVOR'
};

export const ERROR_IN_LOGIN = {
  title: '¡ERROR OCURRIDO!',
  msg: 'OCURRIÓ UN ERROR MIENTRAS INICIABA SESIÓN, POR FAVOR INTÉNTELO DE NUEVO'
};

export const ERROR_IN_STORE = {
  title: '¡ERROR OCURRIDO!',
  msg: 'OCURRIÓ UN ERROR MIENTRAS SE GENERABA LA VENTA, POR FAVOR INTÉNTELO DE NUEVO'
};

export const ERROR_IN_SALE = {
  title: '¡ERROR OCURRIDO!',
  msg: 'OCURRIÓ UN ERROR MIENTRAS SE GENERABA EL REGISTRO DE VENTA, POR FAVOR INTÉNTELO DE NUEVO'
};

export const ERROR_CREATE_FILE = {
  title: '¡ERROR OCURRIDO!',
  msg: 'ERROR OCURRIDO MIENTRAS SE CREABA EL ARCHIVO'
};

export const ERROR_LOGIN = {
  title: 'IMPOSIBLE ACCEDER EN ESTOS MOMENTOS...',
  msg: 'POR FAVOR INTÉNTELO DE NUEVO EN UNOS MINUTOS.'
};

export const ERROR_CHANGE_PASSWORD = {
  title: '¡OH OH!',
  msg: 'ERROR OCURRIDO CAMBIANDO LA CONTRASEÑA '
};

export const MAIL_ERROR = {
  title: 'ALGO SALIÓ MAL.. :(',
  msg: 'ERROR OCURRIDO ABRIENDO LA APLICACIÓN DE CORREO.<br><br>Inténtelo de nuevo más tarde por favor'
};

export const NO_AVAILABLE = {
  title: 'NO DISPONIBLE',
  msg: 'Inténtelo de nuevo más tarde por favor'
};

export const ERROR_UPDATE_USERDATA = {
  title: 'ERROR OCURRIDO',
  msg: 'ERROR OCURRIDO ACTUALIZANDO DATOS DE USUARIO'
};

export const DENIED_ACCESS_MAX_ACCESS_PERMITED = {
  title: 'CUENTA BLOQUEADA',
  msg: '¡SU CUENTA SE ENCUENTRA BLOQUEADA, POR FAVOR CONSULTE CON SU SUPERVISOR!'
};

export const INFO_CENTER_NO_ACTIVE = {
  title: ERROR.title,
  msg: 'NO SE HAN DEFINIDO OBJETIVOS PARA EL CENTRO RECIBIDO'
}

export const FECHA_INVALID = {
  title: 'FECHA INCORRECTA',
  msg: 'IMPOSIBLE CREAR REGISTRO DE VENTA, LA FECHA NO PUEDE SER ANTERIOR AL CORTE EN CURSO NI POSTERIOR A LA FECHA ACTUAL'
};

export const ERROR_WRITE_FILE = {
  title: 'ERROR DE ARCHIVO',
  msg: 'ERROR ESCRIBIENDO EL ARCHIVO'
};

export const CENTER_REQUIRED = {
  title: 'OPERACIÓN NO REALIZADA',
  msg: '¡FALTAN DATOS!<br>EL CENTRO DEL EMPLEADO ES NECESARIO,'
};

export const UPDATE_ERROR = {
  title: 'FALLO DE ACTUALIZACIÓN',
  msg: 'ERROR OCURRIDO MIENTRAS SE REALIZABA LA DESCARGA DE LA ACTUALIZACIÓN, POR FAVOR INTÉNTELO DE NUEVO TRAS REINICIAR LA APP'
};

export const TIME_OUT_RESPONSE = {
  title: 'SIN RESPUESTA...',
  msg: 'IMPOSIBLE CONECTAR CON EL SERVIDOR, POR FAVOR INTÉNTELO DE NUEVO PASADOS UNOS MINUTOS'
};

export const MODE_ACTIVE = {
  title: 'ENTORNO CAMBIADO',
  msg: 'URL: '
};

export const ONLY_IOS_ACTION = {
  title: 'OPERACIÓN NO PERMITIDA',
  msg: 'OPERACIÓN SÓLO VÁLIDA PARA LA PLATAFORMA IOS'
};

export const CONFIRMATION_CREATION_IOS_FILE = {
  title: '¡ARCHIVO CREADO!',
  msg: 'ARCHIVO CREADO CORRECTAMENTE, Reinicie la app para detectar los cambios por favor'
};

export const CONFIRMATION_DELETE_IOS_FILE = {
  title: '¡ARCHIVO BORRADO!',
  msg: 'ARCHIVO BORRADO CORRECTAMENTE, Reinicie la app para detectar los cambios por favor'
};

export const FILE_NOT_EXISTS = {
  title: 'ARCHIVO NO ENCONTRADO',
  msg: 'EL ARCHIVO NO EXISTE'
};




/** DURATIONS AND TIMES **/

export const TIME_WAIT_INIT_ACOUNT_CHECK = 10000;
export const MAX_TIME_LOADING = 45000;
export const NORMAL_TIME_WAIT = 15000;
export const UPDATE_MAX_TIME_LOADING = 60000;
export const SCROLLING_TIME = 1500;
export const MAX_ACCESS_COUNT = 3;
export const MIN_SERVICE_COUNT = 1;
export const WAIT_TO_SLIDE = 3000;
export const DEFAULT_TIME_1S = 1000;
export const SLIDES_PROMOTIONS_TIME = 1500;


/** ARRAYS **/

export const COLUMNS_HEADER_GLOBAL_LEAGUE = ['POSICIÓN', 'CENTRO', 'PUNTOS', 'PCV', 'ACCIÓN'];
export const COLUMNS_HEADER_GLOBAL_WITH_DETAILS = ['POSICIÓN', 'CENTRO', 'PUNTOS', 'PCV', 'ACCIÓN'];
export const COLUMNS_HEADER_CENTRE_LEAGUE = ['MES', 'PUNTOS RECIBIDOS', 'COEFICIENTE DE VENTA'];
export const COPY_MAIL = ['desarrollo@grupoicot.es', 'desarrollo2@grupoicot.es'];