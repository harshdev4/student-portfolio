import React, { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import useAuthQuery from '../../queries/checkAuth.queries';
import useFetchProfileQuery from '../../queries/fetchProfile.queries';
import Loader from '../../components/Loader/Loader';
import { Link, useParams } from 'react-router-dom';
import ProfileImage from '../../components/ProfileImage/ProfileImage';
import { totalSkills } from '../../utils/skills';

const ProfilePage = () => {
  const userId = useParams().id;

  const { data, isFetching, isError } = useFetchProfileQuery(userId, { enabled: !!userId });


  if (isFetching) return <Loader />;

  if (!data?.name)
    return (
      <div className={styles.createProfileButtonContainer}>
        <Link to="/create-profile" className={styles.createProfileButton}>
          Create Your Profile
        </Link>
      </div>
    );

  return (
    <div className={styles.profilePage}>
      <title>Profile - Student Portfolio</title>

      <div className={styles.profileCard}>
        {data?.name && <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            {data?.profile ? <img src={data?.profile} alt="Profile" className={styles.profileImage} />
              : <div className={styles.textProfileIconContainer}> <ProfileImage name={data?.name} width={'200px'}></ProfileImage></div>
            }
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{data?.name}</h1>
            <p className={styles.about}>{data.about}</p>
          </div>
        </div>}

        {data?.college && <div className={styles.collegeContainer}>
          <h2 className={styles.profilePageHeading}>Education</h2>
          <p className={styles.collegeName}>College: <span>{data.college}</span></p>
        </div>}

        <div className={styles.contactSection}>
          <h2>Contact</h2>
          {data.email && <p>Email: <a href={`mailto:${data.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{data.email}</a></p>}
          {data.phone && <p>Phone: <span>{data.phone}</span></p>}
        </div>

       {data?.skills.length > 0 && <div className={styles.skillsContainerDiv}>
          <h2 className={styles.skillHeading}>Skills</h2>
          <div className={styles.skills}>
          {
            data.skills.map((skill, index)=>(
              <i key={index} className={`${skill.class} colored ${styles.skill}`} title={skill.name}></i>
            ))
          }
          </div>
        </div>}

        {data?.achievements.length > 0 && <div className={styles.achievementsSection}>
          <h2>Achievements</h2>
          <ul>
            {data.achievements.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        </div>}

        {data?.projects.length > 0 && <div className={styles.projectsSection}>
          <h2>Projects</h2>
          <div className={styles.projectGrid}>
            {data.projects.map((project, i) => (
              <div key={i} className={styles.projectCard}>
                <a
                  href={project.projectLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={project.projectImage || '/images/project-placeholder.jpg'}
                    alt={project.projectTitle}
                    className={styles.projectImage}
                  />
                </a>
                <h3>{project.projectTitle}</h3>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
};

export default ProfilePage;
