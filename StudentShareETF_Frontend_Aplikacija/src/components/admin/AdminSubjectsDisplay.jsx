import React, { useState, useEffect } from 'react';
import { getSubjects, getMaterials } from '../../services/materialsService';
import { Search } from 'lucide-react';
import SearchInput from '../SearchInput';

function AdminSubjectsDisplay({ onOpenMaterials, startYear = 1 }) {
  const [courses, setCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [hoverId, setHoverId] = useState(null);
  const [searchHover, setSearchHover] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchButtonClicked, setIsClicked] = useState(false);

  const fetchSubjects = async (year) => {
    try {
      const data = await getSubjects(year);
      setCourses(data);
    }catch (error) {
      console.error('Greška pri učitavanju predmeta:', error);
    }
  };

  const fetchMaterials = async (name) => {
    try {
      const response = await getMaterials(name);
      onOpenMaterials(name, response, selectedYear);
    } catch (err) {
      console.error(err);
    }
  };

  const filterSubjectsFirstSemester = (course) => {
    if(course.semester === 1){
      if(isSearchButtonClicked){
        if(course.name.toLowerCase().includes(searchTerm.toLowerCase())){
          return true;
        }else{
          return false;
        }
      }
      return true;
    }else{
      return false;
    }
  }

  const filterSubjectsSecondSemester = (course) => {
    if(course.semester === 2){
      if(isSearchButtonClicked){
        if(course.name.toLowerCase().includes(searchTerm.toLowerCase())){
          return true;
        }else{
          return false;
        }
      }
      return true;
    }else{
      return false;
    }
  }

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchSubjects(year);
  };

  const handleSearch = () => {
    setIsClicked(true);
  };

  const handleClearSearch = () => {
    setIsClicked(false)
    setSearchTerm("");
  }

  useEffect(() => {
    setSelectedYear(startYear)
    fetchSubjects(startYear);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsClicked(false); 
    } else {
      setIsClicked(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchSubjects(selectedYear);
  }, [selectedYear]);

  const firstSemester = courses.filter(filterSubjectsFirstSemester);
  const secondSemester = courses.filter(filterSubjectsSecondSemester);

  return (
    <div style={styles.container}>

      <div style={styles.filterSearchContainer}>
        <div style={styles.filterSearchContent}>
          <div style={styles.inlineWrapper}>
            <div style={styles.searchGroup}>
              <label style={styles.labelUnos}>Unesite naziv predmeta:</label>
              <SearchInput
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                clearFunction={handleClearSearch}
              />
              <button
                style={{
                  ...styles.searchButton,
                  ...(searchHover ? styles.buttonHover : {})
                }}
                onClick={handleSearch}
                onMouseEnter={() => setSearchHover(true)}
                onMouseLeave={() => setSearchHover(false)}
              >
                <Search size={18} /> PRETRAŽI
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.contentContainer}>
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
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #2d3347 0%, #273d52 50%, #22496a 100%)',
  },
  filterSearchContainer: {
    background: 'linear-gradient(180deg, #0f1643 0%, #16213e 100%)',
    padding: '25px 40px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 107, 53, 0.05)',
    border: '1px solid rgba(255, 107, 53, 0.15)',
  },
  filterSearchContent: {
    width: '100%',
  },
  inlineWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '15px',
    flexWrap: 'wrap',
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  labelUnos: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
  },
  searchButton: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
  },
  filterButton: {
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7a600 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    whiteSpace: 'nowrap',
  },
  filterButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
  },
  contentContainer: {
    flex: 1,
    padding: '40px 35px',
  },
  yearButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  yearButton: {
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  yearButtonActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.25)',
    color: '#ff6b35',
    borderColor: '#ff6b35',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
    fontWeight: '700',
  },
  semesterHeaders: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(255, 107, 53, 0.2)',
  },
  semesterHeader: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#ff6b35',
    letterSpacing: '1px',
  },
  courseListsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
  },
  semesterColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  courseButton: {
    padding: '16px 24px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  courseButtonHover: {
    backgroundColor: '#ff6b35',
    color: '#000000',
    transform: 'translateX(8px)',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
    fontWeight: '700',
  },
};

export default AdminSubjectsDisplay;