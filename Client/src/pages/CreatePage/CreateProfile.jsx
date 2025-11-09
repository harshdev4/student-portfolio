import { useEffect, useRef, useState } from "react";
import styles from "./CreateProfile.module.css";
import useAuthQuery from "../../queries/checkAuth.queries";
import useProfileMutation from "../../queries/createProfile.queries";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { useQueryClient } from "@tanstack/react-query";
import useFetchProfileQuery from "../../queries/fetchProfile.queries";
import { totalSkills } from "../../utils/skills";
import { IoIosCloseCircle } from "react-icons/io";

const CreateProfile = () => {
  // ---------- Refs ----------
  const profileInputRef = useRef(null);
  const profileImageRef = useRef(null);
  const dragContentProfileRef = useRef(null);
  const dragContentProjectRef = useRef(null);

  // ---------- State ----------
  const [projects, setProjects] = useState([{ _id: Date.now(), projectImage: "", file: "", projectTitle: "", projectLink: "" }]);
  const [achievements, setAchievements] = useState([]);
  const [skills, setSkills] = useState([]);
  const [suggestionSkills, setSuggestionsSkills] = useState([]);
  const skillInputRef = useRef(null);
  const [formState, setFormState] = useState({
    preview: "",
    profile: "",
    name: "",
    about: "",
    college: "",
    phone: "",
    email: ""
  });




  const { user } = useAuthQuery();
  const userId = user?.userId;

  const { data, isFetching, isFetched } = useFetchProfileQuery(userId, { enabled: !!userId });

  useEffect(() => {
    setFormState({
      preview: data?.profile || "",
      profile: "",
      name: data?.name || "",
      about: data?.about || "",
      college: data?.college || "",
      phone: data?.phone || "",
      email: data?.email || ""
    });

    setSkills(data?.skills || []);

    setAchievements(data?.achievements || [""]);

    setProjects(data?.projects || [{ _id: Date.now(), projectImage: "", file: "", projectTitle: "", projectLink: "" }])

  }, [isFetched]);

  const { mutate: createProfile, isPending, isSuccess, isError, error } = useProfileMutation();



  // ---------- Form Input Handlers -------
  const handleFormInput = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  // skill input handler

  const handleSkillInput = (e) => {
    if (e.target.value == "") {
      return setSuggestionsSkills([]);
    }
    let skillArr = totalSkills.filter((skill) => skill.name.toLowerCase().includes(e.target.value.toLowerCase().trim()));
    skillArr = skillArr.filter(skill => !skills.some((selected)=> selected.name === skill.name));
    setSuggestionsSkills(skillArr);
  }

  const handleSuggestionClick = (suggestedSkill) => {
    setSkills((prev) => [...prev, suggestedSkill])
    setSuggestionsSkills([]);
    skillInputRef.current.value = "";
  }

  const handleRemoveInputSkill = (index) => {
    setSkills((prev)=> prev.filter((_, i) => i != index));
  }

  // ---------- Profile Handlers ----------
  const handleBrowseProfile = () => profileInputRef.current?.click();

  const handleProfileChange = () => {
    const file = profileInputRef.current.files[0];
    if (!file) return;
    const image = URL.createObjectURL(file);
    setFormState({ ...formState, profile: file, preview: image });

  };

  // ---------- Project Handlers ----------
  const handleBrowseProject = (index) => document.getElementById(`projectFile-${index}`)?.click();

  const handleProjectChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const image = URL.createObjectURL(file);
    const updated = [...projects];
    updated[index].projectImage = image;
    updated[index].file = file;
    setProjects(updated);
  };

  const handleAddProject = () => setProjects([...projects, { _id: Date.now(), projectImage: "", file: "", projectTitle: "", projectLink: "" }]);
  const handleRemoveProject = (id) => setProjects(projects.filter((p) => p.id !== id));

  // ---------- Achievement Handlers ----------
  const handleAddAchievement = () => setAchievements([...achievements, ""]);
  const handleRemoveAchievement = (index) => setAchievements(achievements.filter((_, i) => i !== index));
  const handleAchievementChange = (index, value) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  const queryClient = useQueryClient();

  // ------------ Dragover and drop handlers -----------
  const handleAddDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(`${styles.dragOver}`);
  }

  const handleRemoveDragOver = (e) => {
    e.target.classList.remove(`${styles.dragOver}`);
  }

  const handleDropProfile = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(`${styles.dragOver}`);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const image = URL.createObjectURL(file);
    setFormState({ ...formState, profile: file, preview: image });
  }

  const handleDropProject = (e, index) => {
    e.preventDefault();
    e.currentTarget.classList.remove(`${styles.dragOver}`);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const image = URL.createObjectURL(file);
    const updated = [...projects];
    updated[index].projectImage = image;
    updated[index].file = file;
    setProjects(updated);
  }

  // ---------- Save Handler ----------
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("about", formState.about);
    formData.append("college", formState.college);
    formData.append("phone", formState.phone);
    formData.append("email", formState.email);
    if (skills.length > 0) {
      formData.append("skills", JSON.stringify(skills));
    }
    if (formState.profile) {
      formData.append("profile", formState.profile);
    }

    formData.append("achievements", JSON.stringify(achievements));

    if (projects[0]?.projectImage || projects[0]?.projectTitle || projects[0]?.projectLink) {
      projects.forEach((project, index) => {
        formData.append(`projects[${index}][projectTitle]`, project.projectTitle);
        formData.append(`projects[${index}][projectLink]`, project.projectLink);
        if (project.file) {
          formData.append(`projects[${index}]`, project.file);
        }
      });

    }

    createProfile(formData, {
      onSuccess: (data) => {
        toast.success("Profile Created Successfully");
        setAchievements([""]);
        console.log(user.userId);
        queryClient.refetchQueries({
          queryKey: ["profile", `${user.userId}`],
        });
      },
      onError: (error) => {
        toast.error("Failed to save profile");
      }
    })


  };

  // ---------- Render ----------
  return (
    <>
      <title>Create - Student Portfolio</title>
      {isPending && <Loader></Loader>}
      {user &&
        <form className={styles.createProfileContainer} onSubmit={handleSave}>

          {/* Profile Section */}
          <div className={styles.personalInfoDiv}>
            <div className={`${styles.imageFileContainer} ${styles.profileImageFileContainer}`}>
              <input ref={profileInputRef} type="file" name="profileImage" accept="image/*" className={`${styles.profileInput} ${styles.fileInput}`} onChange={handleProfileChange} />
              {formState.preview ?
                <div className={styles.previewProfileImageContainer}><img ref={profileImageRef} src={formState.preview} alt="profile" className={styles.profileImage} /> <button type="button" className={`${styles.button} ${styles.changeImageButton}`} onClick={handleBrowseProfile}>Change Image</button> </div>
                : (
                  <div ref={dragContentProfileRef} className={styles.dragContent} onDragOver={handleAddDragOver} onDragLeave={handleRemoveDragOver} onDrop={handleDropProfile}>
                    <p className={styles.fileUploadText}>Drag & Drop To Upload File</p>
                    <p className={styles.fileUploadTextOR}>OR</p>
                    <button type="button" className={`${styles.addFile} ${styles.addProfile}`} onClick={handleBrowseProfile}>Browse File</button>
                  </div>
                )
              }
            </div>

            <div className={styles.personalInfoDetailsDiv}>
              <label className={styles.inputLabel} htmlFor="name">Name</label>
              <input id="name" name="name" type="text" value={formState.name} className={`${styles.formInput} ${styles.personalInfoDetailsInput}`} placeholder="Name" autoComplete="off" required onChange={handleFormInput} />

              <label className={styles.inputLabel} htmlFor="about">Write about your experience, industry, or skills.</label>
              <textarea id="about" name="about" value={formState.about} placeholder="Write about yourself in 100 words." className={`${styles.formInput} ${styles.personalInfoDetailsInput} ${styles.textareaInput}`} autoComplete="off" onChange={handleFormInput} />
            </div>
          </div>

          {/* Education & Contact */}
          <div className={styles.studyAndContactDiv}>
            <label className={styles.inputLabel} htmlFor="college">College</label>
            <input id="college" name="college" type="text" value={formState.college} className={`${styles.studyAndContactInput} ${styles.formInput}`} placeholder="XYZ College" autoComplete="off" onChange={handleFormInput} />

            <label className={styles.inputLabel} htmlFor="phone">Contact</label>
            <input id="phone" name="phone" type="tel" value={formState.phone} className={`${styles.studyAndContactInput} ${styles.formInput}`} placeholder="+91 9876543210" autoComplete="off" onChange={handleFormInput} />

            <label className={styles.inputLabel} htmlFor="mail">Email</label>
            <input id="mail" name="email" type="email" value={formState.email} className={`${styles.studyAndContactInput} ${styles.formInput}`} placeholder="yourmail@student.com" autoComplete="off" onChange={handleFormInput} />
          </div>

          {/* skills */}
          <div className={styles.skillsDiv}>
            <div className={styles.skillHeaderDiv}>
              <h3 className={`${styles.sectionHeading} ${styles.skillHeading}`}>Your Skills</h3>
              {
                skills.length > 0 && <div className={styles.inputSkillsContainer}>
                  {
                    skills.map((skill, index) => (
                      <div key={index} className={styles.inputSkillDiv}>
                        <span className={styles.inputSkill}>{skill.name}</span>
                        <IoIosCloseCircle className={styles.inputSkillRemove} onClick={()=> handleRemoveInputSkill(index)}/>
                      </div>
                    ))
                  }
                </div>
              }
            </div>
            <input ref={skillInputRef} name="skill" type="text" className={`${styles.skillInput} ${styles.formInput}`} placeholder="Java..." autoComplete="off" onChange={(e) => handleSkillInput(e)} />
            {
              suggestionSkills.length > 0 && <div className={styles.skillSuggestionWindow}>
                {
                  suggestionSkills.map((suggestedSkill, index) => (
                    <div key={index} className={styles.suggestedSkill} onClick={() => handleSuggestionClick(suggestedSkill)}>{suggestedSkill.name}</div>
                  ))
                }
              </div>
            }
          </div>

          {/* Achievements */}
          <div className={styles.achievementsDiv}>
            <div className={styles.achievementHeaderDiv}>
              <h3 className={`${styles.sectionHeading} ${styles.achievementHeading}`}>Your Achievements</h3>
              <button type="button" className={`${styles.button} ${styles.addButton}`} onClick={handleAddAchievement}>+ Add</button>
            </div>

            {achievements.map((a, i) => (
              <div key={i} className={styles.achievement}>
                <input type="text" value={a} placeholder={`Achievement ${i + 1}`} className={`${styles.achievementInput} ${styles.formInput}`} onChange={(e) => handleAchievementChange(i, e.target.value)} autoComplete="off" />
                <button type="button" className={`${styles.button} ${styles.removeButton}`} onClick={() => handleRemoveAchievement(i)}>Remove</button>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className={styles.projectsDiv}>
            <div className={styles.projectHeaderDiv}>
              <h3 className={`${styles.sectionHeading} ${styles.projectHeading}`}>Your Projects</h3>
              <button type="button" className={`${styles.button} ${styles.addButton}`} onClick={handleAddProject}>+ Add</button>
            </div>

            {projects.map((project, index) => (
              <div key={index} className={styles.project}>
                <div className={`${styles.imageFileContainer} ${styles.projectImageFileContainer}`}>
                  <input id={`projectFile-${index}`} type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleProjectChange(e, index)} />
                  {project.projectImage ? (
                    <div className={styles.previewProjectImageContainer}><img src={project.projectImage} alt="project" className={`${styles.projectImage}`} /> <button type="button" className={`${styles.button} ${styles.changeImageButton}`} onClick={() => handleBrowseProject(index)}>Change Image</button> </div>

                  ) : (
                    <div ref={dragContentProjectRef} className={styles.dragContent} onDragOver={handleAddDragOver} onDragLeave={handleRemoveDragOver} onDrop={(e) => handleDropProject(e, index)}>
                      <p className={styles.fileUploadText}>Drag & Drop To Upload File</p>
                      <p className={styles.fileUploadTextOR}>OR</p>
                      <button type="button" className={`${styles.addFile} ${styles.addProfile}`} onClick={() => handleBrowseProject(index)}>Browse File</button>
                    </div>
                  )}
                </div>

                <div>
                  <input type="text" value={project.projectTitle} placeholder="Project Title" className={`${styles.projectInput} ${styles.formInput}`} autoComplete="off" onChange={(e) => { const updated = [...projects]; updated[index].projectTitle = e.target.value; setProjects(updated); }} />
                  <input type="text" value={project.projectLink} placeholder="Project Link" className={`${styles.projectInput} ${styles.formInput}`} autoComplete="off" onChange={(e) => { const updated = [...projects]; updated[index].projectLink = e.target.value; setProjects(updated); }} />
                  <button type="button" className={`${styles.button} ${styles.removeButton}`} onClick={() => handleRemoveProject(project.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button type="submit" className={`${styles.button} ${styles.saveButton}`}>Save</button>
        </form>
      }
    </>
  );
};

export default CreateProfile;
