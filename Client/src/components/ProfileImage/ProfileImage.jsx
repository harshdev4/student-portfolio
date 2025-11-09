import React from 'react'
import styles from './ProfileImage.module.css'
const ProfileImage = ({ name }) => {
  if (!name) {
    return;
  } 
  const nameArr = name.split(' ');
  let initials = nameArr[0][0];

  if (nameArr.length > 1) {
    initials = nameArr[0][0] + nameArr[1][0];
  }
  return (
    <div className={styles.profileImage}>
      {initials}
    </div>
  )
}

export default ProfileImage
