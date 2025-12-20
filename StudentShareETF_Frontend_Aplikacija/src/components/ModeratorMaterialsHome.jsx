import React, { useState, useEffect } from 'react';
import { getSubjects, getMaterials } from "../services/materialsService"; // Uvezen getMaterials
import { Search, ShieldCheck } from 'lucide-react';
import SearchInput from './SearchInput';

function ModeratorMaterialsHome({ onOpenMaterials }) {
  const [courses, setCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [hoverId, setHoverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, setTriggerSearch] = useState("");

  const fetchSubjects = async (year) => {
    try {
      const data = await getSubjects(year);
      setCourses(data);
    } catch (error) {
      console.error('Greška pri učitavanju predmeta:', error);
    }
  };

  // Dodata funkcija za dobavljanje materijala specifičnog predmeta
  const handleCourseClick = async (courseName) => {
    try {
      const materialsData = await getMaterials(courseName);
      // Proslijeđujemo naziv i podatke roditelju (isto kao u tvojoj SubjectsDisplay komponenti)
      onOpenMaterials(courseName, materialsData);
    } catch (error) {
      console.error('Greška pri učitavanju materijala:', error);
    }
  };

  useEffect(() => {
    fetchSubjects(selectedYear);
  }, [selectedYear]);

  const filteredFirstSemester = courses.filter(course => 
    course.semester === 1 && course.name.toLowerCase().includes(triggerSearch.toLowerCase())
  );

  const filteredSecondSemester = courses.filter(course => 
    course.semester === 2 && course.name.toLowerCase().includes(triggerSearch.toLowerCase())
  );

  const handleSearchClick = () => {
    setTriggerSearch(searchTerm);
  };

  return (
    <div style={styles.mainWrapper}>
      <div style={styles.searchSection}>
        <div style={styles.searchGroup}>
          <label style={styles.label}>Unesite naziv predmeta:</label>
          <div style={styles.inputWrapper}>
            <SearchInput 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              clearFunction={() => {setSearchTerm(""); setTriggerSearch("");}}
            />
            <button style={styles.searchButton} onClick={handleSearchClick}>
              <Search size={18} /> PRETRAŽI
            </button>
          </div>
        </div>
        
        <div style={styles.moderatorBadge}>
          <ShieldCheck size={20} color="#60e016" />
          <span style={styles.badgeText}>MODERATOR ZA MATERIJALE</span>
        </div>
      </div>

      <div style={styles.contentSection}>
        <div style={styles.yearContainer}>
          {[1, 2, 3, 4].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={{
                ...styles.yearButton,
                ...(selectedYear === year ? styles.yearButtonActive : {})
              }}
            >
              {year}. godina
            </button>
          ))}
        </div>

        <div style={styles.semesterGrid}>
          <div style={styles.column}>
            <h3 style={styles.semesterTitle}>I SEMESTAR</h3>
            <div style={styles.list}>
              {filteredFirstSemester.map((course, idx) => (
                <button 
                  key={`first-${idx}`} 
                  style={{
                    ...styles.courseButton,
                    ...(hoverId === `first-${idx}` ? styles.courseButtonHover : {})
                  }}
                  onMouseEnter={() => setHoverId(`first-${idx}`)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => handleCourseClick(course.name)} // Poziva novu funkciju
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.column}>
            <h3 style={styles.semesterTitle}>II SEMESTAR</h3>
            <div style={styles.list}>
              {filteredSecondSemester.map((course, idx) => (
                <button 
                  key={`second-${idx}`} 
                  style={{
                    ...styles.courseButton,
                    ...(hoverId === `second-${idx}` ? styles.courseButtonHover : {})
                  }}
                  onMouseEnter={() => setHoverId(`second-${idx}`)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => handleCourseClick(course.name)} // Poziva novu funkciju
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainWrapper: {
    background: 'linear-gradient(135deg, #0a1457 0%, #283a74ff 100%)',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    display: 'flex',          // Dodajemo flex
    flexDirection: 'column',   // Kolona
    height: '100%'            // Mora zauzeti cijelu visinu roditelja
  },
  searchSection: {
    padding: '30px 40px',
    background: 'rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    flexShrink: 0             // Sprečava da se zaglavlje smanji
  },
  searchGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  searchButton: {
    background: '#60e016',
    color: '#0a1457',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '800',
    fontSize: '14px',
    transition: '0.2s'
  },
  label: { color: 'white', fontWeight: '600', fontSize: '14px' },
  moderatorBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    background: 'rgba(96, 224, 22, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(96, 224, 22, 0.3)',
    marginLeft: '30px'
  },
  badgeText: { color: '#60e016', fontSize: '13px', fontWeight: '800', 
    letterSpacing: '0.5px' 
},
  contentSection: {
    padding: '35px 40px',
    flex: 1,                  // Uzima preostali prostor
    overflowY: 'auto',        // OMOGUĆAVA SKROL
    scrollbarWidth: 'thin',    // Za Firefox
    scrollbarColor: '#60e016 rgba(255,255,255,0.1)' // Za Firefox
  },
  yearContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' },
  yearButton: {
    padding: '10px 25px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    cursor: 'pointer',
    transition: '0.3s'
  },
  yearButtonActive: {
    background: '#60e016',
    color: '#000',
    fontWeight: '700',
    borderColor: '#60e016',
  },
  semesterGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' },
  semesterTitle: {
    color: '#60e016',
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center',
    borderBottom: '2px solid rgba(255,255,255,0.1)',
    paddingBottom: '15px',
    marginBottom: '25px'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  courseButton: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: '0.3s',
  },
  courseButtonHover: {
    background: '#60e016',
    color: '#000',
    transform: 'translateX(8px)',
  }
};

export default ModeratorMaterialsHome;