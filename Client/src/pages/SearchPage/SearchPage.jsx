import React, { useState } from 'react';
import styles from './SearchPage.module.css';
import useAuthQuery from '../../queries/checkAuth.queries';
import axiosInstance from '../../utils/axiosInstance.utils';
import { Link } from 'react-router-dom';
import ProfileImage from '../../components/ProfileImage/ProfileImage';

const SearchPage = () => {
  const { user } = useAuthQuery();
  const [studentInput, setStudentInput] = useState('');
  const [students, setStudents] = useState([]);


  const searchUser = async (name) => {
    const response = await axiosInstance.get(`/search?name=${name}`);
    return response.data;
  }

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setStudentInput(value);
    const data = await searchUser(studentInput);
    setStudents(data.students);
  };

  return (
    <>
      <title>Search - Student Portfolio</title>
      {user && (
        <div className={styles.searchPageDiv}>
          <input
            type="text"
            name="text"
            className={styles.searchInput}
            placeholder="Search Students"
            onChange={handleInputChange}
            value={studentInput}
            autoFocus
          />

          {studentInput &&
            <div className={styles.studentsContainer}>
              {students.map((student, index) => (
                <Link title={student.name} to={`/profile/${student._id}`} key={index} className={styles.studentContainer}>
                  {student.profile ? <img src={student.profile} alt="student" className={styles.profileImage} />:
                  <div className={styles.textProfileIconContainer}> <ProfileImage name={student.name}></ProfileImage></div>
                  }
                  <h3 className={styles.studentName}>{student.name}</h3>
                </Link>
              ))}
            </div>
          }
        </div>
      )}
    </>
  );
};

export default SearchPage;
