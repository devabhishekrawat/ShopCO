import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, fetchCurrentUser } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
import Loader from "../components/Loader.jsx";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "",
      });
    }
  }, [user]);

  const isModified = Boolean(
    user &&
      (formData.name !== (user.name || "") ||
        formData.email !== (user.email || "") ||
        formData.phone !== (user.phone || "") ||
        formData.street !== (user.address?.street || "") ||
        formData.city !== (user.address?.city || "") ||
        formData.state !== (user.address?.state || "") ||
        formData.postalCode !== (user.address?.postalCode || "") ||
        formData.country !== (user.address?.country || ""))
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !formData.email.trim()) {
      toast.error("Email Address is required");
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    const updateData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
      },
    };

    try {
      await dispatch(updateUser(updateData)).unwrap();
      toast.success("Profile updated successfully");
      dispatch(fetchCurrentUser());
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  if (!user && loading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <div className="profile-page container">
      <div className="profile-page__header">
        <h1 className="profile-page__title">MY ACCOUNT</h1>
      </div>

      <div className="profile-page__layout">
        <div className="profile-page__card">
          <div className="profile-page__avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-page__info-row">
            <span>Account Role</span>
            <strong className="profile-page__role">{user?.role}</strong>
          </div>

          <div className="profile-page__info-row">
            <span>Registered Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="profile-page__info-row">
            <span>Member Since</span>
            <strong>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</strong>
          </div>
        </div>

        <div className="profile-page__card">
          <h2 className="profile-page__section-title">
            Personal Details & Address
          </h2>

          <form className="profile-page__form" onSubmit={handleSubmit}>
            <div className="profile-page__form-grid">
              <div>
                <label className="profile-page__label">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="profile-page__label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="profile-page__label">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="profile-page__label">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="123 Street Name"
              />
            </div>

            <div className="profile-page__form-grid">
              <div>
                <label className="profile-page__label">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="profile-page__label">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-page__form-grid">
              <div>
                <label className="profile-page__label">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="profile-page__label">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="profile-page__btn"
              disabled={!isModified || loading}
            >
              {loading ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
