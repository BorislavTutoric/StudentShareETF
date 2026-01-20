import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import { getSubjects, getMaterials } from "../services/materialsService";

function SubjectsDisplay({ onOpenMaterials }) {
  const [courses, setCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [hoverId, setHoverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubjects = async (year) => {
    try {
      const data = await getSubjects(year);
      setCourses(data);
    } catch (error) {
      console.error('Greška pri učitavanju predmeta:', error);
    }
  };

  const fetchMaterials = async (name) => {
    try {
      const data = await getMaterials(name);
      onOpenMaterials(name, data); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchSubjects(year);
  };

  useEffect(() => {
    fetchSubjects(1);
  }, []);

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const firstSemester = filteredCourses.filter(course => course.semester === 1);
  const secondSemester = filteredCourses.filter(course => course.semester === 2);

  return (
    <div style={styles.container}>
      <div style={styles.topSection}>
        <div style={styles.searchSection}>
          <span style={styles.searchLabel}>Pretraži predmete</span>
          <SearchInput 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            clearFunction={() => setSearchTerm('')}
          />
        </div>
        
        <div style={styles.yearButtonsContainer}>
          {[1,2,3,4].map(year => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              style={{
                ...styles.yearButton,
                ...(selectedYear === year ? styles.yearButtonActive : {})
              }}
            >
              {year}. godina
            </button>
          ))}
        </div>
      </div>

      <div style={styles.semesterHeaders}>
        <div style={styles.semesterHeader}>I SEMESTAR</div>
        <div style={styles.semesterHeader}>II SEMESTAR</div>
      </div>

      <div style={styles.courseListsContainer}>
        <div style={styles.semesterColumn}>
          {firstSemester.map((course, index) => (
            <button
              key={`first-${index}`}
              style={{
                ...styles.courseButton,
                ...(hoverId === `first-${index}` ? styles.courseButtonHover : {})
              }}
              onClick={() => fetchMaterials(course.name)}
              onMouseEnter={() => setHoverId(`first-${index}`)}
              onMouseLeave={() => setHoverId(null)}
            >
              {course.name}
            </button>
          ))}
        </div>

        <div style={styles.semesterColumn}>
          {secondSemester.map((course, index) => (
            <button
              key={`second-${index}`}
              style={{
                ...styles.courseButton,
                ...(hoverId === `second-${index}` ? styles.courseButtonHover : {})
              }}
              onClick={() => fetchMaterials(course.name)}
              onMouseEnter={() => setHoverId(`second-${index}`)}
              onMouseLeave={() => setHoverId(null)}
            >
              {course.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: 'calc(100vh - 100px)', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    boxSizing: 'border-box',
    padding: '20px 10px',
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '30px',
    paddingLeft: '30px',
    paddingRight: '30px',
    position: 'relative',
  },
  searchSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'flex-start',
  },
  searchLabel: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  yearButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  yearButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '500',
    border: '2px solid #4a5568',
    borderRadius: '25px',
    backgroundColor: '#d4d4d8',
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  yearButtonActive: {
    backgroundColor: '#60e016',
    color: '#ffffff',
    borderColor: '#374151',
    transform: 'scale(1.05)'
  },
  semesterHeaders: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.3)'
  },
  semesterHeader: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffffff',
    letterSpacing: '1px'
  },
  courseListsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    width: '100%',
  },
  semesterColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: "0px 30px"
  },
  courseButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 25px',
    fontSize: '18px',
    fontWeight: '700',
    border: '2px solid #000000ff',
    borderRadius: '40px',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    width: '100%',
    textAlign: 'left',
    boxSizing: 'border-box',
    fontFamily: 'Times New Roman, serif', 
  },
  courseButtonHover: {
    backgroundColor: "#60e016", 
    color: '#ffffff',           
    borderColor: '#ffffffff'
  }
};

export default SubjectsDisplay;