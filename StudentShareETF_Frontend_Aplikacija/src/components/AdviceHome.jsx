import React, { useState, useEffect } from 'react';

import { getSubjectsWithId } from "../services/adviceService"; 
import { getFilteredSubjects } from "../services/materialsService"; 
import AdviceDisplay from './AdviceDisplay'; 
import { Filter, Search } from 'lucide-react';
import SearchInput from './SearchInput'; 
import FilterComponent from './FilterComponent';
import ConfirmationModal from './ConfirmationModal'; 


function AdviceHome({ onOpenAdvice, startYear = 1, subjectsView = "all" }) {
    const [courses, setCourses] = useState([]);
    const [selectedYear, setSelectedYear] = useState(1);
    const [hoverId, setHoverId] = useState(null);
    const [filterHover, setFilterHover] = useState(false);
    const [searchHover, setSearchHover] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [subjects, setSubjects] = useState("all");
    const [isSearchButtonClicked, setIsClicked] = useState(false);

    const [displayAdvice, setDisplayAdvice] = useState(false);
    const [adviceSubject, setAdviceSubject] = useState({ id: null, name: '', year: 0 });

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(null);
    const [message, setMessage] = useState("");
    
    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false);
    }

    const filterMySubjects = () => setSubjects("my");
    const setAllSubjects = () => setSubjects("all");

    const handleFilterClick = () => setFilterOpen(true);
    const handleFilterClose = () => setFilterOpen(false);

    const fetchSubjects = async (year) => {
        try {
            if(subjects === "all") {
                const data = await getSubjectsWithId(year); 
                setCourses(data);
            } else {
                const data = await getFilteredSubjects(year);
                setCourses(data);
            }
        } catch (error) {
            console.error('Greška pri učitavanju predmeta:', error);
        }
    };

    
    const handleOpenAdvice = (id, name, year) => { 
        setAdviceSubject({ id, name, year }); 
        setDisplayAdvice(true);
    };

    const handleBackToSubjects = () => {
        setDisplayAdvice(false);
    };

    
    const handleSubjectClick = (course) => { 
        handleOpenAdvice(course.id, course.name, selectedYear); 
    }
    
    const filterSubjectsFirstSemester = (course) => {
        if(course.semester === 1) {
            if(isSearchButtonClicked){
                return course.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
        }
        return false;
    }

    const filterSubjectsSecondSemester = (course) => {
        if(course.semester === 2) {
            if(isSearchButtonClicked){
                return course.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
        }
        return false;
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
        setSubjects(subjectsView);
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
    }, [subjects, selectedYear]);

    const firstSemester = courses.filter(filterSubjectsFirstSemester);
    const secondSemester = courses.filter(filterSubjectsSecondSemester);

    if (displayAdvice) {
        return (
            <AdviceDisplay 
                subjectId={adviceSubject.id}
                subjectName={adviceSubject.name} 
                year={adviceSubject.year} 
                onBack={handleBackToSubjects}
            />
        );
    }


    return (
        <div style={styles.container}>

            <FilterComponent 
                isOpen={isFilterOpen}
                onClose={handleFilterClose}
                setMySubjects={filterMySubjects}
                setAllSubjects={setAllSubjects}
                subjectsView={subjects}
            />

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

                        <button
                            style={{
                                ...styles.filterButton,
                                ...(filterHover ? styles.filterButtonHover : {})
                            }}
                            onClick={handleFilterClick}
                            onMouseEnter={() => setFilterHover(true)}
                            onMouseLeave={() => setFilterHover(false)}
                        >
                            <Filter size={18} /> FILTRIRAJ
                        </button>
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
                                onClick={() => handleSubjectClick(course)} 
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
                                onClick={() => handleSubjectClick(course)} 
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
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    },
  filterSearchContainer: {
    background: 'linear-gradient(90deg, #0f1643 0%, #1a2a5e 100%)',
    padding: '25px 40px',
    //width: '100%',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  filterSearchContent: {
    //maxWidth: '1200px',
    //margin: '0 auto',
    //width: '100%',
  },
  inlineWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap',
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    flex: 1,
  },
  labelUnos: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
  },
  searchButton: {
    background: 'linear-gradient(135deg, #60e016 0%, #4ec70f 100%)',
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
    boxShadow: '0 4px 12px rgba(96, 224, 22, 0.3)',
  },
  filterButton: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
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
    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
    whiteSpace: 'nowrap',
    marginRight: '40px',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(96, 224, 22, 0.4)',
  },
  filterButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(124, 58, 237, 0.5)',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  contentContainer: {
    flex: 1,
    padding: '40px 20px',
    //maxWidth: '1200px',
    //width: '100%',
    //margin: '0 auto',
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
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  yearButtonActive: {
    backgroundColor: '#60e016',
    color: '#000000',
    borderColor: '#60e016',
    transform: 'scale(1.08)',
    boxShadow: '0 4px 15px rgba(96, 224, 22, 0.4)',
    fontWeight: '700',
  },
  semesterHeaders: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
  },
  semesterHeader: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#60e016',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: '#60e016',
    color: '#000000',
    transform: 'translateX(8px)',
    boxShadow: '0 6px 20px rgba(96, 224, 22, 0.4)',
    fontWeight: '700',
  },
};

export default AdviceHome;