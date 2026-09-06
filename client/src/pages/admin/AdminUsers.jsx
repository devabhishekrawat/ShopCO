import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, updateUserRole, deleteUser } from "../../store/slices/adminSlice.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const currentAdmin = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error(err || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentAdmin?._id) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err || "Failed to delete user");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">User Management</h1>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Manage registered accounts and assign administrative privileges.
          </p>
        </div>
      </div>

      <div className="admin-table-card">
        {loading && !users.length ? (
          <Loader text="Loading users..." />
        ) : users.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            No users registered yet.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                  </td>
                  <td style={{ color: "#555" }}>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === currentAdmin?._id}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ color: "#666" }}>
                    {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === currentAdmin?._id}
                      style={{
                        opacity: u._id === currentAdmin?._id ? 0.3 : 1,
                        cursor: u._id === currentAdmin?._id ? "not-allowed" : "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
