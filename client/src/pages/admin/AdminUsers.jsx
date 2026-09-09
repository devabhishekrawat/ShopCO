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
          <p className="admin-header__subtitle">
            Manage registered accounts and assign administrative privileges.
          </p>
        </div>
      </div>

      <div className="admin-table-card">
        {loading && !users.length ? (
          <Loader text="Loading users..." />
        ) : users.length === 0 ? (
          <div className="admin-table-card__empty">
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
                  <td className="admin-table__email">{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === currentAdmin?._id}
                      className="admin-table__select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="admin-table__date">
                    {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={u._id === currentAdmin?._id}
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
