import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Refresh as RefreshIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import { User, UserFilters } from '../../core/models/user';
import userService from '../../infrastructure/users/UserServiceImpl';
import UserForm from './UserForm';
import ResetPasswordForm from './ResetPasswordForm';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionAnchorEl, setActionAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [openUserForm, setOpenUserForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: UserFilters = {};

      if (searchQuery) {
        filters.search = searchQuery;
      }

      if (roleFilter) {
        filters.role = roleFilter;
      }

      if (statusFilter !== null) {
        filters.isActive = statusFilter;
      }

      const response = await userService.getUsers(filters, page + 1, rowsPerPage);
      if (response.succeeded) {
        setUsers(response.data);
        setTotalUsers(response.data.length); // In a real API, this would come from the response
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    handleFilterClose();
  };

  const handleStatusFilterChange = (status: boolean | null) => {
    setStatusFilter(status);
    handleFilterClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setActionAnchorEl({ ...actionAnchorEl, [userId]: event.currentTarget });
  };

  const handleActionClose = (userId: string) => {
    setActionAnchorEl({ ...actionAnchorEl, [userId]: null });
  };

  const handleAddUser = () => {
    setFormMode('create');
    setCurrentUser(null);
    setOpenUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setFormMode('edit');
    setCurrentUser(user);
    setOpenUserForm(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setOpenDeleteDialog(true);
  };

  const handleResetPassword = (user: User) => {
    setCurrentUser(user);
    setOpenResetPasswordDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await userService.deleteUser(currentUser.id);
      if (response.succeeded) {
        fetchUsers();
        setSelected(selected.filter(id => id !== currentUser.id));
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred while deleting the user');
      console.error(err);
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setCurrentUser(null);
    }
  };

  const handleUserFormSubmit = async () => {
    setOpenUserForm(false);
    fetchUsers();
  };

  const handleResetPasswordSubmit = async () => {
    setOpenResetPasswordDialog(false);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Users
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 2, width: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleFilterClick}
              sx={{ mr: 2 }}
            >
              Filters
            </Button>

            <Tooltip title="Refresh">
              <IconButton onClick={fetchUsers} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Box>
        </Toolbar>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem onClick={() => handleRoleFilterChange('')} selected={roleFilter === ''}>
            All Roles
          </MenuItem>
          <MenuItem onClick={() => handleRoleFilterChange('Admin')} selected={roleFilter === 'Admin'}>
            Admin
          </MenuItem>
          <MenuItem onClick={() => handleRoleFilterChange('Manager')} selected={roleFilter === 'Manager'}>
            Manager
          </MenuItem>
          <MenuItem onClick={() => handleRoleFilterChange('Agent')} selected={roleFilter === 'Agent'}>
            Agent
          </MenuItem>
          <MenuItem onClick={() => handleRoleFilterChange('READONLY')} selected={roleFilter === 'READONLY'}>
            Read Only
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleStatusFilterChange(null)} selected={statusFilter === null}>
            All Status
          </MenuItem>
          <MenuItem onClick={() => handleStatusFilterChange(true)} selected={statusFilter === true}>
            Active
          </MenuItem>
          <MenuItem onClick={() => handleStatusFilterChange(false)} selected={statusFilter === false}>
            Inactive
          </MenuItem>
        </Menu>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              onClick={fetchUsers}
              startIcon={<RefreshIcon />}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < users.length}
                        checked={users.length > 0 && selected.length === users.length}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all users' }}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const isItemSelected = isSelected(user.id);

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={user.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onClick={() => handleClick(user.id)}
                            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${user.id}` }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isActive ? 'Active' : 'Inactive'}
                            color={user.isActive ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEditUser(user)} size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteUser(user)} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset Password">
                            <IconButton onClick={() => handleResetPassword(user)} size="small">
                              <KeyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={(event) => handleActionClick(event, user.id)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                          <Menu
                            anchorEl={actionAnchorEl[user.id]}
                            open={Boolean(actionAnchorEl[user.id])}
                            onClose={() => handleActionClose(user.id)}
                          >
                            <MenuItem onClick={() => {
                              handleActionClose(user.id);
                              handleEditUser(user);
                            }}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={() => {
                              handleActionClose(user.id);
                              handleDeleteUser(user);
                            }}>
                              Delete
                            </MenuItem>
                            <MenuItem onClick={() => {
                              handleActionClose(user.id);
                              handleResetPassword(user);
                            }}>
                              Reset Password
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalUsers}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* User Form Dialog */}
      <UserForm
        open={openUserForm}
        onClose={() => setOpenUserForm(false)}
        onSubmit={handleUserFormSubmit}
        user={currentUser}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "{currentUser?.firstName} {currentUser?.lastName}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <ResetPasswordForm
        open={openResetPasswordDialog}
        onClose={() => setOpenResetPasswordDialog(false)}
        onSubmit={handleResetPasswordSubmit}
        userId={currentUser?.id || ''}
      />
    </Box>
  );
};

export default UsersTable;
