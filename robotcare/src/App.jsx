import {useState} from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  X
} from 'lucide-react';

const API=import.meta.env.VITE_API_URL||'http://localhost:4000';

const robots=[
  {
    name:'Robot Básico',
    type:'ASISTENCIA ESENCIAL',
    image:'/assets/img/robot1.jpeg',
    desc:'Un compañero práctico para recordar rutinas, apoyar tareas sencillas y brindar tranquilidad en el hogar.',
    features:[
      'Recordatorios de medicamentos',
      'Asistencia en rutinas diarias',
      'Interfaz sencilla'
    ]
  },
  {
    name:'Robot Avanzado',
    type:'ASISTENCIA INTELIGENTE',
    image:'/assets/img/robot2.jpeg',
    desc:'Una solución más completa con funciones de seguridad, comunicación y acompañamiento.',
    features:[
      'Detección de caídas (conceptual)',
      'Comunicación por voz',
      'Acompañamiento y alertas'
    ]
  }
];

export default function App(){

  const[menu,setMenu]=useState(false);
  const[status,setStatus]=useState('');
  const[busy,setBusy]=useState(false);
  const[question,setQuestion]=useState('');

  const[chat,setChat]=useState([
    {
      from:'bot',
      text:'¡Hola! Soy el asistente de RobotCare. Puedo contarte sobre nuestros robots y sus funciones. ¿Qué te gustaría saber?'
    }
  ]);

  const[chatBusy,setChatBusy]=useState(false);

  // ESTADOS DE ADMINISTRACIÓN
  const[adminOpen,setAdminOpen]=useState(false);
  const[login,setLogin]=useState({
    username:'',
    password:''
  });
  const[adminStatus,setAdminStatus]=useState('');
  const[adminMessages,setAdminMessages]=useState([]);
  const[isAdmin,setIsAdmin]=useState(false);
  const[adminLoading,setAdminLoading]=useState(false);

  // NUEVOS ESTADOS DEL BUSCADOR Y FILTRO
  const[messageSearch,setMessageSearch]=useState('');
  const[messageFilter,setMessageFilter]=useState('todos');

  // FORMULARIO DE CONTACTO
  async function submitContact(e){
    e.preventDefault();

    const formEl=e.currentTarget;

    setBusy(true);
    setStatus('');

    const f=new FormData(formEl);

    try{
      const r=await fetch(`${API}/api/contact`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          name:f.get('name'),
          email:f.get('email'),
          message:f.get('message'),
          source:'robotcare'
        })
      });

      const d=await r.json();

      if(!r.ok)throw new Error(d.message||'No se pudo enviar.');

      setStatus('¡Gracias! Tu mensaje fue recibido.');
      formEl.reset();

    }catch(err){
      setStatus(`${err.message} Comprueba que el backend esté iniciado.`);
    }finally{
      setBusy(false);
    }
  }

  // CHAT DE ROBOTCARE
  async function sendChat(e){
    e.preventDefault();

    const text=question.trim();

    if(!text||chatBusy)return;

    setChat(c=>[...c,{from:'user',text}]);
    setQuestion('');
    setChatBusy(true);

    try{
      const r=await fetch(`${API}/api/chat`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          message:text
        })
      });

      const d=await r.json();

      if(!r.ok)throw new Error('No se pudo obtener una respuesta.');

      setChat(c=>[
        ...c,
        {
          from:'bot',
          text:d.reply||'No pude procesar la pregunta.'
        }
      ]);

    }catch{
      setChat(c=>[
        ...c,
        {
          from:'bot',
          text:'No puedo conectar con el servidor ahora. Inténtalo de nuevo más tarde.'
        }
      ]);
    }finally{
      setChatBusy(false);
    }
  }

  // CARGAR MENSAJES DE ADMINISTRACIÓN
  async function loadAdminMessages(){

    const token=sessionStorage.getItem('robotcare_token');

    if(!token){
      setIsAdmin(false);
      setAdminStatus('La sesión ha expirado. Inicia sesión nuevamente.');
      return;
    }

    setAdminLoading(true);

    try{
      const r=await fetch(`${API}/api/admin/messages`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      const d=await r.json();

      if(!r.ok){

        if(r.status===401||r.status===403){
          adminLogout();
          throw new Error('La sesión ha expirado. Inicia sesión nuevamente.');
        }

        throw new Error(d.message||'No se pudieron cargar los mensajes.');
      }

      setAdminMessages(d.messages||[]);
      setAdminStatus('');

    }catch(err){
      setAdminStatus(err.message);
    }finally{
      setAdminLoading(false);
    }
  }

  // INICIAR SESIÓN DE ADMINISTRADOR
  async function adminLogin(e){
    e.preventDefault();

    setAdminStatus('');
    setAdminLoading(true);

    try{
      const r=await fetch(`${API}/api/auth/login`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(login)
      });

      const d=await r.json();

      if(!r.ok){
        throw new Error(d.message||'Credenciales incorrectas.');
      }

      if(!d.token){
        throw new Error('El servidor no proporcionó un token de acceso.');
      }

      sessionStorage.setItem('robotcare_token',d.token);

      setIsAdmin(true);
      setAdminStatus('Sesión iniciada correctamente.');

      await loadAdminMessages();

    }catch(err){
      setIsAdmin(false);
      setAdminStatus(err.message);
    }finally{
      setAdminLoading(false);
    }
  }

  // CERRAR SESIÓN DE ADMINISTRADOR
  function adminLogout(){

    sessionStorage.removeItem('robotcare_token');

    setIsAdmin(false);
    setAdminMessages([]);
    setMessageSearch('');
    setMessageFilter('todos');

    setLogin({
      username:'',
      password:''
    });

    setAdminStatus('Sesión cerrada correctamente.');
  }

  // ESTADÍSTICAS DE MENSAJES
  const totalMessages=adminMessages.length;

  const robotcareMessages=adminMessages.filter(
    m=>m.source==='robotcare'
  ).length;

  const portfolioMessages=adminMessages.filter(
    m=>m.source==='portfolio'
  ).length;

  // BUSCAR Y FILTRAR MENSAJES
  const filteredMessages=adminMessages.filter(m=>{

    const search=messageSearch.trim().toLowerCase();

    const matchesSearch=
      !search||
      (m.name||'').toLowerCase().includes(search)||
      (m.email||'').toLowerCase().includes(search)||
      (m.message||'').toLowerCase().includes(search);

    const matchesFilter=
      messageFilter==='todos'||
      m.source===messageFilter;

    return matchesSearch&&matchesFilter;
  });

  const close=()=>setMenu(false);

  return <>

    {/* ENCABEZADO */}
    <header className="rc-header">

      <a className="rc-brand" href="#inicio">
        <span className="brand-mark">R</span>
        Robot<span>Care</span>
      </a>

      <button
        className="rc-menu-btn"
        onClick={()=>setMenu(!menu)}
        aria-label="Abrir menú"
      >
        {menu?<X/>:<Menu/>}
      </button>

      <nav className={menu?'rc-nav open':'rc-nav'}>

        <a href="#inicio" onClick={close}>Inicio</a>
        <a href="#beneficios" onClick={close}>Beneficios</a>
        <a href="#catalogo" onClick={close}>Catálogo</a>
        <a href="#contacto" onClick={close}>Contacto</a>

        <button
          className="admin-link"
          onClick={()=>{
            setAdminOpen(!adminOpen);
            close();
          }}
        >
          Administración
        </button>

      </nav>
    </header>

    <main>

      {/* PORTADA */}
      <section className="rc-hero" id="inicio">

        <div className="rc-hero-content">

          <p className="rc-eyebrow">
            TECNOLOGÍA CON PROPÓSITO
          </p>

          <h1>
            Un cuidado más<br/>
            <span>cercano e inteligente.</span>
          </h1>

          <p className="rc-lead">
            Robots asistenciales diseñados para acompañar,
            apoyar rutinas y promover la autonomía de adultos
            mayores y personas con movilidad reducida.
          </p>

          <div className="rc-actions">

            <a className="rc-button" href="#catalogo">
              Conoce nuestros robots <ArrowRight size={17}/>
            </a>

            <a className="rc-link" href="#beneficios">
              Descubre cómo ayudan ↓
            </a>

          </div>

          <div className="rc-trust">
            <span><ShieldCheck/> Tecnología de apoyo</span>
            <span><HeartHandshake/> Enfoque humano</span>
          </div>

        </div>

        <div className="rc-hero-image">

          <img
            src="/assets/img/fondo2.jpeg"
            alt="Tecnología robótica asistencial"
          />

          <div className="image-caption">
            <span className="pulse"/>
            Innovación al servicio de las personas
          </div>

        </div>

      </section>

      {/* BENEFICIOS */}
      <section className="rc-benefits" id="beneficios">

        <div className="rc-section-head">

          <p className="rc-eyebrow">CUIDADO Y AUTONOMÍA</p>

          <h2>Más apoyo para el día a día.</h2>

          <p>
            La tecnología puede ser una aliada para las personas y sus familias.
          </p>

        </div>

        <div className="benefit-grid">

          <article>
            <span className="benefit-icon"><Activity/></span>
            <h3>Rutinas acompañadas</h3>
            <p>
              Recordatorios y asistencia para organizar actividades cotidianas.
            </p>
          </article>

          <article>
            <span className="benefit-icon"><ShieldCheck/></span>
            <h3>Mayor tranquilidad</h3>
            <p>
              Funciones de apoyo y alertas que pueden complementar el cuidado humano.
            </p>
          </article>

          <article>
            <span className="benefit-icon"><HeartHandshake/></span>
            <h3>Compañía cercana</h3>
            <p>
              Interacción sencilla y herramientas pensadas para facilitar la comunicación.
            </p>
          </article>

        </div>
      </section>

      {/* CATÁLOGO */}
      <section className="rc-catalog" id="catalogo">

        <div className="rc-section-head">

          <p className="rc-eyebrow">NUESTRO CATÁLOGO</p>

          <h2>Conoce las soluciones.</h2>

          <p>
            Dos propuestas conceptuales para distintas necesidades de asistencia.
          </p>

        </div>

        <div className="robot-grid">

          {robots.map((r,i)=>(
            <article className="robot-card" key={r.name}>

              <div className="robot-photo">

                <img src={r.image} alt={r.name}/>

                <span>0{i+1}</span>

              </div>

              <div className="robot-info">

                <p className="robot-type">{r.type}</p>

                <h3>{r.name}</h3>

                <p>{r.desc}</p>

                <ul>
                  {r.features.map(f=>(
                    <li key={f}>
                      <CheckCircle2/>{f}
                    </li>
                  ))}
                </ul>

                <a href="#contacto">
                  Solicitar información <ArrowRight size={16}/>
                </a>

              </div>

            </article>
          ))}

        </div>

        <p className="disclaimer">
          Nota: las características descritas son propuestas ilustrativas
          del proyecto académico y no representan certificaciones médicas
          ni dispositivos comerciales validados.
        </p>

      </section>

      {/* CONTACTO */}
      <section className="rc-contact" id="contacto">

        <div className="rc-contact-copy">

          <p className="rc-eyebrow">HABLEMOS</p>

          <h2>
            Estamos aquí para<br/>
            <span>ayudarte.</span>
          </h2>

          <p>
            Escríbenos para conocer más sobre RobotCare y sus propuestas de asistencia.
          </p>

          <div className="rc-contact-detail">
            <MessageCircle/> robotcare@gmail.com
          </div>

        </div>

        <form className="rc-form" onSubmit={submitContact}>

          <label>
            Nombre
            <input
              name="name"
              required
              minLength="2"
              maxLength="80"
              placeholder="Tu nombre"
            />
          </label>

          <label>
            Correo electrónico
            <input
              name="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label>
            ¿En qué podemos ayudarte?
            <textarea
              name="message"
              required
              minLength="5"
              maxLength="2000"
              rows="4"
              placeholder="Escribe tu mensaje..."
            />
          </label>

          <button className="rc-button" disabled={busy}>
            {busy?'Enviando...':'Enviar mensaje'}
            <ArrowRight size={17}/>
          </button>

          {status&&(
            <p className="rc-status" role="status">
              {status}
            </p>
          )}

        </form>

      </section>

      {/* ASISTENTE */}
      <section className="rc-assistant">

        <div>

          <p className="rc-eyebrow">ASISTENTE ROBOTCARE</p>

          <h2>¿Tienes alguna pregunta?</h2>

          <p>
            Consulta información general sobre los robots y sus funciones.
          </p>

        </div>

        <div className="chat-box">

          <div className="chat-title">

            <span className="bot-avatar">R</span>

            <div>
              <strong>Asistente RobotCare</strong>
              <small>Respuestas automáticas</small>
            </div>

          </div>

          <div className="chat-messages" aria-live="polite">

            {chat.map((m,i)=>(
              <p
                className={`chat-message ${m.from}`}
                key={i}
              >
                {m.text}
              </p>
            ))}

            {chatBusy&&(
              <p className="chat-message bot">
                Escribiendo...
              </p>
            )}

          </div>

          <form className="chat-input" onSubmit={sendChat}>

            <input
              value={question}
              onChange={e=>setQuestion(e.target.value)}
              placeholder="Pregunta por los robots..."
              aria-label="Tu pregunta"
            />

            <button
              disabled={chatBusy||!question.trim()}
              aria-label="Enviar pregunta"
            >
              <ArrowRight/>
            </button>

          </form>

        </div>

      </section>

      {/* PANEL DE ADMINISTRACIÓN MEJORADO */}
      {adminOpen&&
        <section className="admin-panel" id="admin">

          <div className="admin-intro">

            <p className="rc-eyebrow">
              ACCESO RESTRINGIDO
            </p>

            <h2>Administración</h2>

            <p>
              {isAdmin
                ? 'Panel de control de RobotCare. Administra y consulta los mensajes recibidos.'
                : 'Inicia sesión con las credenciales configuradas en el servidor.'}
            </p>

          </div>

          {!isAdmin ? (

            <form onSubmit={adminLogin} className="admin-login-form">

              <label>
                Usuario

                <input
                  value={login.username}
                  onChange={e=>setLogin({
                    ...login,
                    username:e.target.value
                  })}
                  required
                  autoComplete="username"
                />

              </label>

              <label>
                Contraseña

                <input
                  type="password"
                  value={login.password}
                  onChange={e=>setLogin({
                    ...login,
                    password:e.target.value
                  })}
                  required
                  autoComplete="current-password"
                />

              </label>

              <button
                className="rc-button"
                disabled={adminLoading}
              >
                {adminLoading?'Iniciando sesión...':'Ingresar'}
                <ArrowRight size={16}/>
              </button>

              {adminStatus&&(
                <p className="rc-status" role="status">
                  {adminStatus}
                </p>
              )}

            </form>

          ) : (

            <div className="admin-dashboard">

              <div className="admin-topbar">

                <div>
                  <span className="admin-online-dot"/>
                  <strong>Sesión de administrador activa</strong>
                </div>

                <div className="admin-actions">

                  <button
                    type="button"
                    className="rc-button"
                    onClick={loadAdminMessages}
                    disabled={adminLoading}
                  >
                    {adminLoading?'Actualizando...':'Actualizar mensajes'}
                  </button>

                  <button
                    type="button"
                    className="admin-logout"
                    onClick={adminLogout}
                  >
                    Cerrar sesión
                  </button>

                </div>

              </div>

              {adminStatus&&(
                <p className="rc-status" role="status">
                  {adminStatus}
                </p>
              )}

              {/* INDICADORES */}
              <div className="admin-stats">

                <article className="admin-stat-card">
                  <span className="admin-stat-icon"><MessageCircle/></span>
                  <div>
                    <small>Total de mensajes</small>
                    <strong>{totalMessages}</strong>
                  </div>
                </article>

                <article className="admin-stat-card">
                  <span className="admin-stat-icon"><HeartHandshake/></span>
                  <div>
                    <small>Mensajes de RobotCare</small>
                    <strong>{robotcareMessages}</strong>
                  </div>
                </article>

                <article className="admin-stat-card">
                  <span className="admin-stat-icon"><Activity/></span>
                  <div>
                    <small>Mensajes del Portfolio</small>
                    <strong>{portfolioMessages}</strong>
                  </div>
                </article>

              </div>

              {/* LISTADO Y HERRAMIENTAS */}
              <div className="admin-messages">

                <div className="admin-list-heading">
                  <div>
                    <p className="rc-eyebrow">BANDEJA DE ENTRADA</p>
                    <h3>Mensajes recibidos</h3>
                    <p>Consulta y encuentra fácilmente los mensajes de tus visitantes.</p>
                  </div>

                  <span className="admin-result-count">
                    {filteredMessages.length} de {totalMessages}
                  </span>
                </div>

                <div className="admin-tools">

                  <div className="admin-search">
                    <Search size={18}/>
                    <input
                      type="search"
                      value={messageSearch}
                      onChange={e=>setMessageSearch(e.target.value)}
                      placeholder="Buscar por nombre, correo o mensaje..."
                      aria-label="Buscar mensajes"
                    />
                  </div>

                  <select
                    value={messageFilter}
                    onChange={e=>setMessageFilter(e.target.value)}
                    aria-label="Filtrar mensajes por origen"
                    className="admin-filter"
                  >

                    <option value="todos">Todos los mensajes</option>
                    <option value="robotcare">Solo RobotCare</option>
                    <option value="portfolio">Solo Portfolio</option>

                  </select>

                </div>

                {adminLoading&&(
                  <p className="admin-empty">Cargando mensajes...</p>
                )}

                {!adminLoading&&totalMessages===0&&(
                  <div className="admin-empty">
                    <MessageCircle size={28}/>
                    <strong>Tu bandeja está vacía</strong>
                    <p>Cuando alguien envíe un mensaje desde el formulario, aparecerá aquí.</p>
                  </div>
                )}

                {!adminLoading&&totalMessages>0&&filteredMessages.length===0&&(
                  <div className="admin-empty">
                    <Search size={28}/>
                    <strong>No se encontraron mensajes</strong>
                    <p>Prueba con otro nombre, correo o filtro de búsqueda.</p>
                    <button
                      type="button"
                      className="admin-clear-search"
                      onClick={()=>{
                        setMessageSearch('');
                        setMessageFilter('todos');
                      }}
                    >
                      Limpiar búsqueda y filtros
                    </button>
                  </div>
                )}

                {!adminLoading&&filteredMessages.map(m=>(
                  <article className="admin-message-card" key={m.id}>

                    <div className="admin-message-header">

                      <div className="admin-sender">
                        <span className="admin-sender-avatar">
                          {(m.name||'?').trim().charAt(0).toUpperCase()}
                        </span>

                        <div>
                          <strong>{m.name}</strong>
                          <a href={`mailto:${m.email}`}>{m.email}</a>
                        </div>
                      </div>

                      <span className={`admin-source ${m.source==='robotcare'?'source-robotcare':'source-portfolio'}`}>
                        {m.source==='robotcare'?'RobotCare':m.source==='portfolio'?'Portfolio':'Sitio web'}
                      </span>

                    </div>

                    <p className="admin-message-text">{m.message}</p>

                    <div className="admin-message-date">
                      <span>Mensaje #{m.id}</span>
                      <span>{m.created_at}</span>
                    </div>

                  </article>
                ))}

              </div>

            </div>

          )}

        </section>
      }

    </main>

    {/* PIE DE PÁGINA */}
    <footer className="rc-footer">

      <a className="rc-brand" href="#inicio">
        <span className="brand-mark">R</span>
        Robot<span>Care</span>
      </a>

      <p>
        © {new Date().getFullYear()} RobotCare. Proyecto académico.
      </p>

      <a href="http://localhost:5173">
        Portafolio de Matias ↗
      </a>

    </footer>

  </>;
}