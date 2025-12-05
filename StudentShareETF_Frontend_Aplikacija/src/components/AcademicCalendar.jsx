import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, GraduationCap } from 'lucide-react';
import { getAcademicCalendar, getTasks, openAcademicCalendar } from '../services/calendarService,';
import Toast from './Toast';

function AkademskiKalendar({ 
  calendarFile, 
  facultyEvents = {
    '0-15': [
      { name: 'Ispit iz Programiranja', time: '09:00' },
      { name: 'Ispit iz Matematike', time: '14:00' }
    ],
    '0-20': [
      { name: 'Ispit iz Fizike', time: '10:30' }
    ],
    '1-10': [
      { name: 'Ispit iz Baze Podataka', time: '13:00' }
    ],
    '11-5': [
      { name: 'Ispit iz Engleskog Jezika', time: '08:00' },
      { name: 'Ispit iz Algoritama', time: '11:00' },
      { name: 'Ispit iz Baza Podataka', time: '15:30' }
    ],
  }
}) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const [currentMonth, setCurrentMonth] = useState(currentMonthIndex);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [hoveredTaskButton, setHoveredTaskButton] = useState(false);
  const [personalizedEvents, setPersonalizedEvents] = useState({});
  const [showFacultyEvents, setShowFacultyEvents] = useState(false);
  const [toast, setToast] = useState(null);

  const monthNames = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
  const months = monthNames.map((name, index) => ({ name, year: currentYear }));
  const daysOfWeek = ['Ponedeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };
  
  const getDaysInMonth = (monthIndex) => {
    const year = months[monthIndex].year;
    const monthNum = monthIndex + 1;
    return new Date(year, monthNum, 0).getDate();
  };

  const getFirstDayOfMonth = (monthIndex) => {
    const year = months[monthIndex].year;
    const monthNum = monthIndex;
    return new Date(year, monthNum, 1).getDay() || 7;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 1; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getTaskKey = () => `${currentMonth}-${selectedDate}`;

  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev < 11 ? prev + 1 : 0));
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleDateClick2 = async (day) => {
    if (day) {
      const year = months[currentMonth].year;
      const month = currentMonth + 1; 
      const dayString = day;

      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${dayString.toString().padStart(2, '0')}`;
      
      try{
          const response = await getTasks(formattedDate);
          setTasks(response);
      }catch(err){
        console.log(err);
      }
    }
  };

  const handleFileClick = async (fileId) => {
    try{
      const url = await openAcademicCalendar(fileId);
      window.open(url, "_blank");
    } catch(err){
      console.error(err);
      showToast(`${err}`, 'error');
    }
  };

  const addTask = () => {
    if (newTask.trim() && selectedDate) {
      const key = getTaskKey();
      const taskData = {
        title: newTask,
        description: newTaskDescription,
      };
      setTasks(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), taskData]
      }));
      setNewTask('');
      setNewTaskDescription('');
    }
  };

  const removeTask = (index) => {
    const key = getTaskKey();
    const removedTask = tasks[key][index];

    const eventName = removedTask?.title?.split(" (")[0];

    setTasks(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));

    if (personalizedEvents[key]?.includes(eventName)) {
      setPersonalizedEvents(prev => ({
        ...prev,
        [key]: prev[key].filter(name => name !== eventName)
      }));
    }
  };


  const addFacultyEventToPersonal = (event) => {
    if (!selectedDate) return;

    const key = getTaskKey();
    const eventText = `${event.name} (${event.time})`;

    const alreadyAdded = personalizedEvents[key]?.includes(event.name);

    if (alreadyAdded) {
      setPersonalizedEvents(prev => ({
      ...prev,
      [key]: prev[key].filter(name => name !== event.name)
    }));

   
    setTasks(prev => ({
      ...prev,
      [key]: prev[key].filter(t => t.title !== eventText)
    }));

    } else {
      const taskData = {
        title: eventText,
        description: '',
      };

      setTasks(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), taskData]
      }));

      setPersonalizedEvents(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), event.name]
      }));
    }
  };

  const calendarDays = generateCalendarDays();
  const currentTasks = selectedDate ? tasks[getTaskKey()] || [] : [];
  const currentFacultyEvents = selectedDate ? facultyEvents[getTaskKey()] || [] : [];

  const hasPersonalTasksOnDate = (day) => {
    const key = `${currentMonth}-${day}`;
    return tasks[key] && tasks[key].length > 0;
  };

  const hasFacultyEventsOnDate = (day) => {
    const key = `${currentMonth}-${day}`;
    return facultyEvents[key] && facultyEvents[key].length > 0;
  };

  return (
    <div style={styles.container}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>Akademski Kalendar</h2>
          {calendarFile && (
            <button style={styles.downloadBtn} onClick={() => handleFileClick(calendarFile.id)}>
              <span style={styles.downloadIcon}>📄</span>
              {calendarFile.title}
            </button>
          )}
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* KALENDAR */}
        <div style={styles.calendarContainer}>
          <div style={styles.monthHeader}>
            <button style={styles.navButton} onClick={handlePrevMonth}>
              <ChevronLeft size={20} color="#ffffff" />
            </button>
            <h3 style={styles.monthTitle}>
              {months[currentMonth].name} {months[currentMonth].year}.
            </h3>
            <button style={styles.navButton} onClick={handleNextMonth}>
              <ChevronRight size={20} color="#ffffff" />
            </button>
          </div>

          <div style={styles.daysOfWeekContainer}>
            {daysOfWeek.map((day) => (
              <div key={day} style={styles.dayOfWeekLabel}>
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          <div style={styles.daysGrid}>
            {calendarDays.map((day, index) => (
              <button
                key={index}
                style={{
                  ...styles.dayButton,
                  ...(day === null ? styles.dayButtonEmpty : {}),
                  ...(selectedDate === day ? styles.dayButtonSelected : {}),
                  ...(day && (hasPersonalTasksOnDate(day) || hasFacultyEventsOnDate(day)) ? styles.dayButtonWithTasks : {}),
                }}
                onClick={() => handleDateClick(day)}
                disabled={day === null}
              >
                <div style={styles.dayButtonContent}>
                  <span>{day}</span>
                  {day && (hasPersonalTasksOnDate(day) || hasFacultyEventsOnDate(day)) && (
                    <div style={styles.indicatorsContainer}>
                      {hasPersonalTasksOnDate(day) && (
                        <div style={styles.taskIndicator}></div>
                      )}
                      {hasFacultyEventsOnDate(day) && (
                        <div style={styles.facultyIndicator}></div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div style={styles.legendContainer}>
            <div style={styles.legendItem}>
              <div style={styles.taskIndicator}></div>
              <span style={styles.legendText}>Moje obaveze</span>
            </div>
            <div style={styles.legendItem}>
              <div style={styles.facultyIndicator}></div>
              <span style={styles.legendText}>Fakultetski ispiti</span>
            </div>
          </div>
        </div>

        {/* OBAVEZE */}
        <div style={styles.tasksContainer}>
          <h3 style={styles.tasksTitle}>Planiraj Sopstvene Obaveze</h3>
          
          {selectedDate ? (
            <>
              <div style={styles.selectedDateDisplay}>
                <span style={styles.selectedDateLabel}>Odabrani datum:</span>
                <span style={styles.selectedDateValue}>
                  {selectedDate}. {months[currentMonth].name} {months[currentMonth].year}
                </span>
              </div>

              <div style={styles.taskInputContainer}>
                <input
                  type="text"
                  placeholder="Upiši novu obavezu..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  style={styles.taskInput}
                />
                <button
                  style={{
                    ...styles.addTaskBtn,
                    ...(hoveredTaskButton ? styles.addTaskBtnHover : {})
                  }}
                  onClick={addTask}
                  onMouseEnter={() => setHoveredTaskButton(true)}
                  onMouseLeave={() => setHoveredTaskButton(false)}
                >
                  <Plus size={18} />
                </button>
              </div>

              <textarea
                placeholder="Opis obaveze (opcionalno)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                style={styles.taskDescription}
              />

              {/* DUGME ZA FAKULTETSKE OBAVEZE */}
              {currentFacultyEvents.length > 0 && (
                <button 
                  style={styles.facultyToggleBtn}
                  onClick={() => setShowFacultyEvents(!showFacultyEvents)}
                >
                  <GraduationCap size={18} />
                  <span>Fakultetske Obaveze ({currentFacultyEvents.length})</span>
                  <span style={{
                    ...styles.toggleArrow,
                    transform: showFacultyEvents ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </button>
              )}

              {/* FAKULTETSKI DOGAĐAJI */}
              {showFacultyEvents && currentFacultyEvents.length > 0 && (
                <div style={styles.facultySection}>
                  <h4 style={styles.facultyTitle}>📚 Ispiti</h4>
                  <div style={styles.facultyEventsList}>
                    {currentFacultyEvents.map((event, index) => {
                      const isAdded = personalizedEvents[getTaskKey()]?.includes(event.name);
                      return (
                        <div key={index} style={styles.facultyEventItem}>
                          <div style={styles.facultyEventContent}>
                            <span style={styles.facultyEventText}>{event.name}</span>
                            <span style={styles.facultyEventTime}>🕐 {event.time}</span>
                          </div>
                          <button
                            style={{
                              ...styles.addEventBtn,
                              ...(isAdded ? styles.addEventBtnActive : {})
                            }}
                            onClick={() => addFacultyEventToPersonal(event)}
                          >
                            {isAdded ? '✓' : '+'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MOJE OBAVEZE */}
              <h4 style={styles.personalTasksTitle}>✓ Moje Obaveze</h4>
              <div style={styles.tasksList}>
                {currentTasks.length > 0 ? (
                  currentTasks.map((task, index) => (
                    <div key={index} style={styles.taskItem}>
                      <div style={styles.taskContent}>
                        <span style={styles.taskText}>
                          {typeof task === 'string' ? task : task.title}
                        </span>
                        {typeof task !== 'string' && task.description && (
                          <span style={styles.taskDescriptionText}>
                            {task.description}
                          </span>
                        )}
                      </div>
                      <button
                        style={styles.deleteTaskBtn}
                        onClick={() => removeTask(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={styles.noTasksMessage}>
                    Nema obaveza za ovaj datum
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.noDateSelected}>
              <span>👆 Odaberi datum sa kalendara</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #0a1457 0%, #1a2a5e 50%, #2a1f5e 100%)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(96, 224, 22, 0.1)',
    transition: 'all 0.4s ease',
    minHeight: '100vh',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(96, 224, 22, 0.15)',
  },

  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },

  title: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '800',
    margin: '0',
    letterSpacing: '0.5px',
    background: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  downloadBtn: {
    background: 'rgba(96, 224, 22, 0.15)',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    borderRadius: '10px',
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#60e016',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    outline: 'none',
    width: 'fit-content',
  },

  downloadIcon: {
    fontSize: '16px',
  },

  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },

  // KALENDAR STILOVI
  calendarContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    padding: '28px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(96, 224, 22, 0.1)',
  },

  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },

  monthTitle: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0',
    letterSpacing: '0.4px',
  },

  navButton: {
    background: 'rgba(96, 224, 22, 0.1)',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },

  daysOfWeekContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px',
    marginBottom: '12px',
  },

  dayOfWeekLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    padding: '8px 0',
  },

  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },

  dayButton: {
    background: 'rgba(96, 224, 22, 0.12)',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    borderRadius: '10px',
    padding: '14px 8px',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    outline: 'none',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayButtonEmpty: {
    background: 'transparent',
    border: 'none',
    cursor: 'default',
    color: 'transparent',
  },

  dayButtonSelected: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    borderColor: '#a8edea',
    color: '#0a1457',
    fontWeight: '700',
    boxShadow: '0 6px 20px rgba(168, 237, 234, 0.4)',
    transform: 'scale(1.05)',
  },

  dayButtonWithTasks: {
    borderColor: '#60e016',
    border: '2px solid #60e016',
    boxShadow: '0 0 12px rgba(96, 224, 22, 0.6)',
  },

  dayButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    height: '100%',
  },

  indicatorsContainer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center',
  },

  taskIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    boxShadow: '0 0 4px rgba(168, 237, 234, 0.6)',
  },

  facultyIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    boxShadow: '0 0 4px rgba(96, 224, 22, 0.6)',
  },

  legendContainer: {
    background: 'rgba(96, 224, 22, 0.1)',
    border: '2px solid rgba(96, 224, 22, 0.25)',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'center',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  legendText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },

  // OBAVEZE STILOVI
  tasksContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    padding: '28px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(96, 224, 22, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  tasksTitle: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '0.4px',
  },

  selectedDateDisplay: {
    background: 'rgba(168, 237, 234, 0.1)',
    border: '2px solid rgba(168, 237, 234, 0.25)',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  selectedDateLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  selectedDateValue: {
    color: '#a8edea',
    fontSize: '16px',
    fontWeight: '700',
  },

  taskInputContainer: {
    display: 'flex',
    gap: '8px',
  },

  taskInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },

  addTaskBtn: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#0a1457',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '700',
  },

  addTaskBtnHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(168, 237, 234, 0.4)',
  },

  taskDescription: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '60px',
    maxHeight: '100px',
  },

  // DUGME ZA FAKULTETSKE OBAVEZE
  facultyToggleBtn: {
    background: 'rgba(96, 224, 22, 0.15)',
    border: '2px solid rgba(96, 224, 22, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#60e016',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    outline: 'none',
    width: '100%',
  },

  toggleArrow: {
    fontSize: '12px',
    transition: 'transform 0.3s ease',
  },

  // FAKULTETSKI DOGAĐAJI
  facultySection: {
    background: 'rgba(168, 237, 234, 0.05)',
    border: '2px solid rgba(168, 237, 234, 0.2)',
    borderRadius: '10px',
    padding: '14px',
  },

  facultyTitle: {
    color: '#a8edea',
    fontSize: '14px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },

  facultyEventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  facultyEventItem: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(168, 237, 234, 0.3)',
    borderRadius: '8px',
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },

  facultyEventContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },

  facultyEventText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '13px',
    fontWeight: '600',
  },

  facultyEventTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    fontWeight: '500',
  },

  addEventBtn: {
    background: 'rgba(168, 237, 234, 0.2)',
    border: '2px solid rgba(168, 237, 234, 0.4)',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    color: '#a8edea',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
    minWidth: '32px',
  },

  addEventBtnActive: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    borderColor: '#a8edea',
    color: '#0a1457',
    boxShadow: '0 4px 12px rgba(168, 237, 234, 0.3)',
  },

  personalTasksTitle: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },

  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
  },

  taskItem: {
    background: 'rgba(96, 224, 22, 0.1)',
    border: '2px solid rgba(96, 224, 22, 0.2)',
    borderRadius: '10px',
    padding: '12px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
  },

  taskContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },

  taskText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
  },

  taskDescriptionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    fontWeight: '400',
    fontStyle: 'italic',
  },

  deleteTaskBtn: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
  },

  noTasksMessage: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    padding: '20px 10px',
  },

  noDateSelected: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
    fontWeight: '600',
    textAlign: 'center',
    padding: '40px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};

export default AkademskiKalendar;