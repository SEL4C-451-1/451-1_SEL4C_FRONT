import React from "react";
import { Box, Typography } from '@mui/material';
import { Sel4cTable } from "../components/Sel4cTable";
import AdminModal from "../components/Admin/AdminModal";
import { columns as usersColumns, getData as getUsers, deleteData as deleteUser } from "../models/users";
import { formResponseColumns, getData as getFormResponses } from "../models/forms";
import { activitiesColumns } from "../models/activities";

const Admin = () => {
    const [usersData, setUsersData] = React.useState([]);
    const [formResponseData, setFormResponseData] = React.useState([]);
    const [activitiesData, setActivitiesData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponseData = await getUsers();
                setUsersData(userResponseData);
                const formResponseData = await getFormResponses();
                setFormResponseData(formResponseData);
                //const activitiesData = await getActivities();
                //setActivitiesData(activitiesData);
            } catch (error) {
                // Handle errors, e.g., show an error message
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const handleUserCreationSuccess = (userData) => {
        setUsersData([...usersData, userData]);
    };

    const handleUserRowsDelete = async (rowsDeleted, newTableData) => {
        try {
            const updatedUsersData = [...usersData];

            for (const row of rowsDeleted.data) {
                const rowIndex = row.dataIndex;
                // Update the is_active property to false for the user
                updatedUsersData[rowIndex].is_active = false;

                const userIdToDelete = updatedUsersData[rowIndex].user;
                // Deactivate user in the backend
                await deleteUser(userIdToDelete);
            }

            // Set the updated copy as the new state for usersData
            setUsersData(updatedUsersData);
        } catch (error) {
            console.error('Error deleting user(s):', error);
        }
    };



    return (
        <div>
            <div id="admin-content">
                <Box sx={{
                    width: '100%',
                    padding: '3rem'
                }}>
                    <Typography variant="h3" align="center"> Usuarios y actividades </Typography>
                    <Sel4cTable
                        title="Usuarios"
                        data={usersData}
                        columns={usersColumns}
                        options={{
                            customToolbar: () => <AdminModal onSuccess={handleUserCreationSuccess} />,
                            onRowsDelete: handleUserRowsDelete,
                            selectableRowsOnClick: true,
                        }}
                    />
                    <Sel4cTable
                        title="Respuestas de formulario"
                        data={formResponseData}
                        columns={formResponseColumns}
                    />
                    <Sel4cTable
                        title="Actividades"
                        data={activitiesData}
                        columns={activitiesColumns}
                    />
                </Box>
            </div>
        </div>
    );
}

export default Admin;