import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, GraduationCap } from 'lucide-react';
import { openAcademicCalendar } from '../services/calendarService,';
import { addTaskApi, deleteTask, getMyMonthTasksApi } from '../services/taskService';
import Toast from './Toast';
import FlipPicker from './FlipPicker';

function AkademskiKalendar({ calendarFile, facultyTasks = [], myTasks = [], handleMonthTasks}) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const [displayYear, setDisplayYear] = useState(currentYear);
  const [currentMonth, setCurrentMonth] = useState(currentMonthIndex);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskHour, setNewTaskHour] = useState(9);
  const [newTaskMinute, setNewTaskMinute] = useState(0);
  const [includeTime, setIncludeTime] = useState(false);
  const [hoveredTaskButton, setHoveredTaskButton] = useState(false);
  const [personalizedEvents, setPersonalizedEvents] = useState({});
  const [showFacultyEvents, setShowFacultyEvents] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [facultyTasksOnDate, setFacultyTasksOnDate] = useState(null);
  const [myTasksOnDate, setMyTasksOnDate] = useState(null);
  const [myMonthTasks, setMyMonthTasks] = useState(myTasks ?? []);
  const [facultyMonthTasks, setFacultyMonthTasks] = useState(facultyTasks ?? []);
  const [isTaskAdded, setIsTaskAdded] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const monthNames = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
  const months = monthNames.map((name, index) => ({ name, year: displayYear }));
  const daysOfWeek = ['Ponedeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const scrollToModal = () => {
    setTimeout(() => {
      const modalElement = document.querySelector('[data-modal="task-details"]');
      if (modalElement) {
        modalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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
    let month = currentMonth;
    let year = displayYear;
    if (currentMonth > 0) { 
      setCurrentMonth(prev => prev - 1); 
      month = currentMonth;
      handleMonthTasks(month, year);
    } else { 
      if (displayYear > currentYear) { 
        setCurrentMonth(11); 
        month = 12
        setDisplayYear(prev => prev - 1); 
        year = year - 1;
        handleMonthTasks(month, year);
      } 
    } 
  }; 

  const handleNextMonth = () => { 
    let month = currentMonth;
    let year = displayYear;
    if (currentMonth < 11) { 
      setCurrentMonth(prev => prev + 1);
      month = currentMonth + 2;
    } else { 
      setCurrentMonth(0); 
      month = 1;
      setDisplayYear(prev => prev + 1); 
      year = year + 1;
    } 
    handleMonthTasks(month, year); 
  };

  const handleDateClick = (day) => {
    if (day) {
      const year = months[currentMonth].year;
      const month = currentMonth + 1; 
      const dayString = day;

      setSelectedDate(day)
      
      handleFacultyEvents(day);

      getMyDayTasks(day);
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

  const handleFacultyEvents = (targetDay) => {
    const dayFacultyTasks = facultyMonthTasks.filter(task => {
      const day = task.date.slice(0, -1).split(".")[0]; 
      return Number(day) === targetDay;
    });
    setFacultyTasksOnDate(dayFacultyTasks);
  }

  const getMyDayTasks = (targetDay) => {
    const myDayTasks = myMonthTasks.filter(task => {
      const day = Number(task.date.split("-")[2]);
      return day === Number(targetDay);
    });
    setMyTasksOnDate(myDayTasks);
  }

  const addTask = async () => {
    if (newTask.trim() && selectedDate) {
      let timeString = '';
      
      if (includeTime) {
        timeString = `${String(newTaskHour).padStart(2, '0')}:${String(newTaskMinute).padStart(2, '0')}`;
      }

      const year = months[currentMonth].year;
      const month = currentMonth + 1; 
      const dayString = selectedDate;
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${dayString.toString().padStart(2, '0')}`;

      try{
        const response = await addTaskApi(newTask, newTaskDescription, formattedDate, timeString, "personal");
        const taskData = {
          id: response,
          title: newTask,
          description: newTaskDescription,
          date: formattedDate,
          time: timeString,
          isFaculcy: false
        };
        setMyTasksOnDate(prev => [...prev, taskData]);
        setMyMonthTasks(prev => [...prev, taskData]);
        setIsTaskAdded(prev => {
          const exists = prev.some(
            el => el.day === selectedDate && el.month === currentMonth && el.yearr === year
          );
  
          if (exists) {
            return prev; 
          }

          return [...prev, { day: selectedDate, month: currentMonth, yearr: year, isAdded: true }];
        });
        setNewTask('');
        setNewTaskDescription('');
        setNewTaskHour(9);
        setNewTaskMinute(0);
        setIncludeTime(false);
        setShowTaskForm(false);
        showToast('Dodali ste obavezu!', 'success');
      }catch(err){
        console.error(err);
        showToast(`${err}`, 'error');
      }
    }
  };

  const isAdded = (day) => {
    const item = isTaskAdded.find(el => el.day === day && el.month === currentMonth && el.yearr === months[currentMonth].year);
    if(item){
      return item.isAdded;
    }
  } 

  const removeTask = async (index, taskId) => {
    setMyTasksOnDate(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setMyMonthTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setIsTaskAdded(prevTasks => prevTasks.filter(task => {
      return !(task.day === selectedDate && task.month === currentMonth && task.yearr === months[currentMonth].year);
    }));
    try{
      const response = await deleteTask(taskId);
      showToast(response, "success");
    }catch(err){
      console.error(err);
      showToast(`${err}`, 'error');
    }
  };

  const isFacultyTaskAdded = (title) => {
    //console.log(title);
    //console.log("PROMJENA → myTasksOnDate:", myTasksOnDate);
    return myTasksOnDate.some(task => { 
      return task.title ===`Ispit: ${title}` && task.faculcy;
    });
  }

  const getFacultyTaskId = (title) => {
    const task = myMonthTasks.find(task => task.title.includes(`Ispit: ${title}`) && task.faculcy);
    return task ? task.id : 0; 
  };

  const addFacultyTaskToPersonal = async (task) => {
    if (!selectedDate) return;

    if(!isFacultyTaskAdded(task.title)){
      const year = months[currentMonth].year;
      const month = currentMonth + 1; 
      const dayString = selectedDate;
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${dayString.toString().padStart(2, '0')}`;

      try{
        const response = await addTaskApi(`Ispit: ${task.title}`, `Ispit će se održati u učionici: ${task.room}.`, formattedDate, task.time, "faculcy");
        const taskData = {
            id: response,
            title: `Ispit: ${task.title}`,
            description: `Ispit će se održati u učionici: ${task.room}.`,
            date: formattedDate,
            time: task.time,
            faculcy: true
        };
        setMyTasksOnDate(prev => [...prev, taskData]);
        setMyMonthTasks(prev => [...prev, taskData]);
        setIsTaskAdded(prev => {
          const exists = prev.some(
            el => el.day === selectedDate && el.month === currentMonth && el.yearr === year
          );
  
          if (exists) {
            return prev; 
          }

          return [...prev, { day: selectedDate, month: currentMonth, yearr: year, isAdded: true }];
        });
      }catch(err){
        console.error(err);
        showToast(`${err}`, 'error');
      }
    }else{
      const taskId = getFacultyTaskId(task.title);
      setMyTasksOnDate(prev => prev.filter(t => t.id !== taskId));
      setMyMonthTasks(prev => prev.filter(t => t.id !== taskId));
      setIsTaskAdded(prevTasks => prevTasks.filter(task => {
        return !(task.day === selectedDate && task.month === currentMonth && task.yearr === months[currentMonth].year);
      }));
      try{
        const response = await deleteTask(taskId);
        //showToast(response, "success");
      }catch(err){
        console.error(err);
        showToast(`${err}`, 'error');
      }
    }
  };

  const calendarDays = generateCalendarDays();

  const hasPersonalTasksOnDate = (targetDay) => {
    return myMonthTasks.some(task => {
      const day = task.date.split("-")[2]; 
      return Number(day) === targetDay;
    });
  };

  const hasFacultyEventsOnDate = (targetDay) => {
    return facultyMonthTasks.some(task => {
      const day = task.date.slice(0, -1).split(".")[0]; 
      return Number(day) === targetDay;
    });
  };

  useEffect(() => {
    setMyMonthTasks(myTasks ?? []);
  }, [myTasks]);

  useEffect(() => {
    setFacultyMonthTasks(facultyTasks ?? []);
  }, [facultyTasks]);

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
                  ...(day && (hasPersonalTasksOnDate(day) || hasFacultyEventsOnDate(day) || isAdded(day)) ? styles.dayButtonWithTasks : {}),
                }}
                onClick={() => handleDateClick(day)}
                disabled={day === null}
              >
                <div style={styles.dayButtonContent}>
                  <span>{day}</span>
                  {day && (hasPersonalTasksOnDate(day) || hasFacultyEventsOnDate(day) || isAdded(day)) && (
                    <div style={styles.indicatorsContainer}>
                      {(hasPersonalTasksOnDate(day) || isAdded(day)) && (
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

              {/* DUGME ZA DODAJ OBAVEZU */}
              <button
                style={{
                  ...styles.addObavezuBtn,
                  ...(showTaskForm ? styles.addObavezuBtnActive : {})
                }}
                onClick={() => setShowTaskForm(!showTaskForm)}
              >
                <Plus size={18} />
                <span>Dodaj Obavezu</span>
              </button>

              {/* FORMA ZA DODAVANJE OBAVEZE */}
              {showTaskForm && (
                <div style={styles.taskFormContainer}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Naslov obaveze *</label>
                    <input
                      type="text"
                      placeholder="Upiši obavezu..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Opis (opciono)</label>
                    <textarea
                      placeholder="Opis obaveze..."
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      style={styles.formTextarea}
                    />
                  </div>

                  {/* CHECKBOX ZA VRIJEME */}
                  <div style={styles.timeCheckboxGroup}>
                    <input
                      type="checkbox"
                      id="includeTimeCheckbox"
                      checked={includeTime}
                      onChange={(e) => setIncludeTime(e.target.checked)}
                      style={styles.timeCheckbox}
                    />
                    <label htmlFor="includeTimeCheckbox" style={styles.timeCheckboxLabel}>
                      Dodaj vrijeme (opciono)
                    </label>
                  </div>

                  {/* VRIJEME - VIDLJIVO SAMO AKO JE CHECKED */}
                  {includeTime && (
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Vrijeme</label>
                      <div style={styles.timePickerWrapper}>
                        <FlipPicker 
                          value={newTaskHour} 
                          onChange={setNewTaskHour} 
                          min={0} 
                          max={23}
                        />
                        <div style={styles.separator}>:</div>
                        <FlipPicker 
                          value={newTaskMinute} 
                          onChange={setNewTaskMinute} 
                          min={0} 
                          max={59}
                        />
                      </div>
                    </div>
                  )}

                  <div style={styles.formButtonsContainer}>
                    <button
                      style={{
                        ...styles.submitBtn,
                        ...(hoveredTaskButton ? styles.submitBtnHover : {})
                      }}
                      onClick={addTask}
                      onMouseEnter={() => setHoveredTaskButton(true)}
                      onMouseLeave={() => setHoveredTaskButton(false)}
                    >
                      <Plus size={16} />
                      Dodaj
                    </button>
                    <button
                      style={styles.cancelBtn}
                      onClick={() => setShowTaskForm(false)}
                    >
                      Otkaži
                    </button>
                  </div>
                </div>
              )}

              {/* DUGME ZA FAKULTETSKE OBAVEZE */}
              {(hasFacultyEventsOnDate(selectedDate)) && (
                <button 
                  style={styles.facultyToggleBtn}
                  onClick={() => {
                      setShowFacultyEvents(!showFacultyEvents);
                    }
                  }
                >
                  <GraduationCap size={18} />
                  <span>Fakultetske Obaveze {facultyTasksOnDate.length}</span>
                  <span style={{
                    ...styles.toggleArrow,
                    transform: showFacultyEvents ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </button>
              )}

              {/* FAKULTETSKI DOGAĐAJI */}
              {showFacultyEvents && facultyTasksOnDate.length > 0 && (
                <div style={styles.facultySection}>
                  <h4 style={styles.facultyTitle}>📚 Ispiti</h4>
                  <div style={styles.facultyEventsList}>
                    {facultyTasksOnDate.map((event, index) => {
                      const isAdded = isFacultyTaskAdded(event.title);
                      console.log(isAdded);
                      return (
                        <div key={index} style={styles.facultyEventItem}>
                          <div style={styles.facultyEventContent}>
                            <span style={styles.facultyEventText}>{event.title}</span>
                            <span style={styles.facultyEventTime}>🕐 {event.time}</span>
                            <span style={styles.facultyEventTime}>📝 {event.room}</span>
                          </div>
                          <button
                            style={{
                              ...styles.addEventBtn,
                              ...(isAdded ? styles.addEventBtnActive : {})
                            }}
                            onClick={() => addFacultyTaskToPersonal(event)}
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
                {myTasksOnDate.length > 0 ? (
                  myTasksOnDate.map((task, index) => (
                    <div key={index} style={styles.taskItem} onClick={() => {
                      setSelectedTask(task);
                      setShowTaskDetails(true);
                      scrollToModal(); 
                    }}>
                      <div style={styles.taskContent}>
                        <span style={styles.taskText}>
                          {task.title}
                        </span>
                        {task.description && (
                          <span style={styles.taskDescriptionText}>
                            📝 {task.description}
                          </span>
                        )}
                        {task.time !== "00:00" && (
                          <span style={styles.taskDescriptionText}>
                            🕐 {task.time}
                          </span>
                        )}
                      </div>
                      <button
                        style={styles.deleteTaskBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(index, task.id)
                        }}
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
          {showTaskDetails && selectedTask && (
            <div style={styles.modalOverlay} onClick={() => setShowTaskDetails(false)} data-modal="task-details"> 
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button 
                  style={styles.modalCloseBtn}
                  onClick={() => {
                    setShowTaskDetails(false);
                  }}
                >
                  ✕
                </button>
      
                <h3 style={styles.modalTitle}>Obaveza</h3>
      
                <div style={styles.detailsSection}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Naslov:</span>
                    <span style={styles.detailValue}>{selectedTask.title}</span>
                  </div>

                  {selectedTask.description && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Opis:</span>
                      <span style={styles.detailValue}>{selectedTask.description}</span>
                    </div>
                  )}

                  {selectedTask.time && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Vrijeme:</span>
                      <span style={styles.detailValue}>{selectedTask.time}</span>
                    </div>
                  )}

                  {selectedTask.date && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Datum:</span>
                      <span style={styles.detailValue}>{selectedTask.date}</span>
                    </div>
                  )}
                </div>

                <button
                  style={styles.modalCloseButtonBottom}
                  onClick={() => setShowTaskDetails(false)}
                >
                  Zatvori
                </button>
              </div>
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

  addObavezuBtn: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#0a1457',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '700',
    fontSize: '14px',
    width: '100%',
  },

  addObavezuBtnActive: {
    background: 'rgba(168, 237, 234, 0.25)',
    color: '#a8edea',
    boxShadow: '0 0 12px rgba(168, 237, 234, 0.3)',
  },

  taskFormContainer: {
    background: 'rgba(168, 237, 234, 0.08)',
    border: '2px solid rgba(168, 237, 234, 0.2)',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  formLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  formInput: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },

  formTextarea: {
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
    minHeight: '50px',
    maxHeight: '80px',
  },

  timeCheckboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: 'rgba(96, 224, 22, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(96, 224, 22, 0.2)',
  },

  timeCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#60e016',
  },

  timeCheckboxLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  timePickerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },

  separator: {
    color: '#a8edea',
    fontSize: '24px',
    fontWeight: '300',
    opacity: 0.8,
  },

  formButtonsContainer: {
    display: 'flex',
    gap: '8px',
  },

  submitBtn: {
    background: 'rgba(96, 224, 22, 0.2)',
    border: '2px solid rgba(96, 224, 22, 0.4)',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    color: '#60e016',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '700',
    fontSize: '13px',
    flex: 1,
  },

  submitBtnHover: {
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    color: '#0a1457',
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.4)',
  },

  cancelBtn: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: '700',
    fontSize: '13px',
    flex: 1,
  },

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
    cursor: "pointer"
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

  modalOverlay: {
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(10, 20, 87, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
    overflowY: 'auto',
  },

  modalContent: {
    background: 'linear-gradient(135deg, rgba(168, 237, 234, 0.95) 0%, rgba(254, 214, 227, 0.95) 100%)',
    borderRadius: '16px',
    padding: '24px',
    border: '2px solid rgba(168, 237, 234, 0.5)',
    boxShadow: '0 12px 40px rgba(168, 237, 234, 0.3), 0 0 30px rgba(168, 237, 234, 0.15)',
    maxWidth: '380px',
    width: '90%',
    position: 'relative',
  },

  modalCloseBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    color: '#0a1457',
    fontSize: '18px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    transition: 'all 0.3s ease',
  },

  modalTitle: {
    color: '#0a1457',
    fontSize: '20px',
    fontWeight: '800',
    margin: '0 0 18px 0',
    letterSpacing: '0.4px',
    textAlign: 'center',
  },

  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '18px',
  },

  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 2px 8px rgba(10, 20, 87, 0.06)',
  },

  detailLabel: {
    color: 'rgba(10, 20, 87, 0.6)',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  detailValue: {
    color: '#0a1457',
    fontSize: '13px',
    fontWeight: '600',
    wordWrap: 'break-word',
    lineHeight: '1.4',
  },

  modalCloseButtonBottom: {
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 16px',
    cursor: 'pointer',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '14px',
    width: '100%',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 16px rgba(96, 224, 22, 0.25)',
  },
};

export default AkademskiKalendar;