import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import DashboardLayout from "@/layout/DashboardLayout";
import { BASE_URL, clientServer } from "@/config";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import {
  getAllComments,
  getAllPosts,
  incrementPostLike,
  postComment,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import Styles from "../dashboard/styles.module.css";

function Profile() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModelOpen2, setIsModelOpen2] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [inputData2, setInputData2] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  const [commentText, setCommentText] = useState("");
  const [commentUser, setCommentUser] = useState({});

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setInputData2({ ...inputData2, [name]: value });
  };
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);
  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastwork: userProfile.pastwork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={style.container}>
            <div className={style.backDropContainer}>
              <div className={style.backDrop}>
                <label
                  htmlFor="ProfilePictureUpdate"
                  className={style.backDrop__Overlay}
                >
                  <p>Edit</p>
                </label>
                <input
                  onChange={(e) => {
                    updateProfilePicture(e.target.files[0]);
                  }}
                  hidden
                  type="file"
                  id="ProfilePictureUpdate"
                ></input>
                <img
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                  alt="backDrop"
                ></img>
              </div>
            </div>
            <div className={style.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection:"column",
                      width: "fit-content",
                    }}
                  >
                    <input
                      className={style.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <p style={{ color: "grey", marginLeft:"10px"}}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  ></div>

                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={style.workHistory}>
              <h4>Work History</h4>
              <div className={style.workHistoryContainer}>
                {userProfile.pastwork.length === 0 && (
                  <p style={{ color: "grey" }}>Not Added</p>
                )}
                {userProfile.pastwork.map((work, index) => {
                  return (
                    <div key={index} className={style.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
              </div>
              <button
                className={style.addWorkBtn}
                onClick={() => {
                  setIsModelOpen(true);
                }}
              >
                Add Work
              </button>
            </div>

            <div style={{ marginTop: "1rem" }} className={style.workHistory}>
              <h4>Education</h4>
              <div className={style.workHistoryContainer}>
                {userProfile.education.length === 0 && (
                  <p style={{ color: "grey" }}>Not Added</p>
                )}
                {userProfile.education.map((education, index) => {
                  return (
                    <div key={index} className={style.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        School - {education.school}
                      </p>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        Degree - {education.degree}
                      </p>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        Field Of Study - {education.fieldOfStudy}
                      </p>
                    </div>
                  );
                })}
              </div>
              <button
                className={style.addWorkBtn}
                onClick={() => {
                  setIsModelOpen2(true);
                }}
              >
                Add Education
              </button>
            </div>
          </div>
        )}

        {isModelOpen && (
          <div
            onClick={() => {
              setIsModelOpen(false);
            }}
            className={style.commentContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={style.allCommentContainer}
            >
              <input
                onChange={handleWorkInputChange}
                name="company"
                className={style.inputField}
                type="text"
                placeholder="Enter Company"
              ></input>
              <input
                onChange={handleWorkInputChange}
                name="position"
                className={style.inputField}
                type="text"
                placeholder="Enter Position"
              ></input>
              <input
                onChange={handleWorkInputChange}
                name="years"
                className={style.inputField}
                type="number"
                placeholder="years"
              ></input>
              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastwork: [...userProfile.pastwork, inputData],
                  });
                  setIsModelOpen(false);
                }}
                className={style.updateProfileBtn}
              >
                Add work
              </div>
            </div>
          </div>
        )}
        {isModelOpen2 && (
          <div
            onClick={() => {
              setIsModelOpen2(false);
            }}
            className={style.commentContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={style.allCommentContainer}
            >
              <input
                onChange={handleEducationInputChange}
                name="school"
                className={style.inputField}
                type="text"
                placeholder="School"
              ></input>
              <input
                onChange={handleEducationInputChange}
                name="degree"
                className={style.inputField}
                type="text"
                placeholder="degree"
              ></input>
              <input
                onChange={handleEducationInputChange}
                name="fieldOfStudy"
                className={style.inputField}
                type="text"
                placeholder="Field of Study"
              ></input>
              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...userProfile.education, inputData2],
                  });
                  setIsModelOpen2(false);
                }}
                className={style.updateProfileBtn}
              >
                Add Education
              </div>
            </div>
          </div>
        )}

        {userProfile != authState.user && (
          <div
            onClick={() => {
              updateProfileData();
            }}
            className={style.updateProfileBtn}
          >
            Update Profile
          </div>
        )}
        <br></br>
        <hr></hr>
        <div style={{ flex: "0.2", marginTop: "20px" }}>
          <h3>Recent Activity</h3>
          {userPosts.map((post) => {
            return (
              <div key={post.id} className={style.postCard}>
                <div className={style.card}>
                  <p>{post.body}</p>
                  <div className={style.card_profileContainer}>
                    {post.media !== "" ? (
                      <img src={`${BASE_URL}/${post.media}`} alt=""></img>
                    ) : (
                      <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "1.2rem" }}>
                    <div
                      style={{ display: "flex", gap: "1rem" }}
                      onClick={async () => {
                        await dispatch(
                          incrementPostLike({ post_id: post._id }),
                        );
                        dispatch(getAllPosts());
                      }}
                    >
                      <svg
                        style={{ width: "1.2rem" }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <p>{post.likes}</p>
                    </div>

                    <div
                      onClick={() => {
                        dispatch(getAllComments({ post_id: post._id }));
                      }}
                      className={style.singleOption_optionsContainer}
                    >
                      <svg
                        style={{ width: "1.2rem" }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                    </div>

                    <div
                      onClick={() => {
                        const text = encodeURIComponent(post.body);
                        const url = encodeURIComponent("apnacollege.in");
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                        window.open(twitterUrl, "_blank");
                      }}
                      className={style.singleOption_optionsContainer}
                    >
                      <svg
                        style={{ width: "1.2rem" }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {postReducer.postId !== "" && (
          <div
            onClick={() => {
              dispatch(resetPostId());
            }}
            className={Styles.commentContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={Styles.allCommentContainer}
            >
              {postReducer.comments.length === 0 && <h2>No Comments</h2>}

              {postReducer.comments.length != 0 && (
                <div>
                  {postReducer.comments.map((postComment, index) => {
                    return (
                      <>
                        <div className={Styles.singleComment} key={index}>
                          <div
                            className={Styles.singleComment__profileContainer}
                          >
                           
                            <div>
                             <p style={{ fontWeight: "bold", fontSize: "1.2rem"}}>
              {postComment.userId.name}
            </p>
            <p>@{postComment.userId.username}</p>
                            </div>
                          </div>
                        </div>

                        <p>{postComment.body}</p>
                      </>
                    );
                  })}
                </div>
              )}

              <div className={Styles.postCommentContainer}>
                <input
                  type=""
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Comment"
                />
                <div
                  onClick={async () => {
                    await dispatch(
                      postComment({
                        post_id: postReducer.postId,
                        body: commentText,
                      }),
                    );
                    await dispatch(
                      getAllComments({ post_id: postReducer.postId }),
                    );
                    setCommentUser(authState.user);
                    console.log(commentUser);
                  }}
                  className={Styles.postCommentContainer_commentBtn}
                >
                  <p>Add</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default Profile;
