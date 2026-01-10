import React, { useState, useEffect } from 'react';
import { getSubjects, getMaterials } from '../../../services/materialsService';
import { Filter, Search } from 'lucide-react';
import SearchInput from '../../SearchInput';

function ModeratorMaterialsSubjectsDisplay({ onOpenMaterials, startYear = 1 }) {
  const [courses, setCourses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [hoverId, setHoverId] = useState(null);
  const [searchHover, setSearchHover] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchButtonClicked, setIsClicked] = useState(false);

  // Dodaj webkit scrollbar stilove
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .moderator-subjects-container::-webkit-scrollbar {
        width: 10px;
      }
      .moderator-subjects-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        margin: 4px;
      }
      .moderator-subjects-container::-webkit-scrollbar-thumb {
        background: #6366f1;
        border-radius: 5px;
      }
      .moderator-subjects-container::-webkit-scrollbar-thumb:hover {
        background: #818cf8;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
    if(course.semester === 1)
    {
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
    if(course.semester === 2)
    {
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
    <div style={styles.outerContainer}>
      <div style={styles.container} className="moderator-subjects-container">
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
    </div>
  );
}

const styles = {
  outerContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 16px 32px 32px',
    gap: '24px',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: '#6366f1 rgba(255,255,255,0.1)',
    boxSizing: 'border-box',
  },
  filterSearchContainer: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    padding: '20px',
    border: '2px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    flexShrink: 0,
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
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    whiteSpace: 'nowrap',
    letterSpacing: '0.3px',
  },
  searchButton: {
    background: '#8b5cf6',
    color: '#ffffff',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(139, 92, 246, 0.5)',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minHeight: 'min-content',
  },
  yearButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    flexShrink: 0,
  },
  yearButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  yearButtonActive: {
    background: '#8b5cf6',
    borderColor: '#8b5cf6',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
  },
  semesterHeaders: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '8px',
    flexShrink: 0,
  },
  semesterHeader: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#8b5cf6',
    letterSpacing: '0.5px',
    padding: '12px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(168, 85, 247, 0.05) 100%)',
    border: '2px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
  },
  courseListsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    minHeight: 'min-content',
  },
  semesterColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  courseButton: {
    padding: '16px 20px',
    border: '2px solid rgba(139, 92, 246, 0.25)',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    backdropFilter: 'blur(10px)',
    letterSpacing: '0.3px',
  },
  courseButtonHover: {
    background: '#8b5cf6',
    borderColor: '#8b5cf6',
    transform: 'translateX(8px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
  },
};

export default ModeratorMaterialsSubjectsDisplay;