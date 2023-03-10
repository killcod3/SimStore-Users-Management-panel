import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { userService } from 'services';
import { alertService } from 'services';

export default Index;

function Index() {
    const [users, setUsers] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    //console.log(filteredData)
    // var classlayout;

    useEffect(() => {
        userService.getAll().then(x => {setUsers(x),localStorage.setItem('users', JSON.stringify(x))})
    }, []);
    useEffect(() => {
        setFilteredData(users)

    }, [users])
    // console.log(filteredData)
    
    const filterBySearchTerm = (searchTerm) => {
        const filtered = users.filter((row) => row.key.toLowerCase().includes(searchTerm.toLowerCase()) || row.name.toLowerCase().includes(searchTerm.toLowerCase()) || row.user.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredData(filtered);
        //console.log(filteredData)
      }

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        userService.delete(id).then(() => {
            alertService.success('User Deleted', { keepAfterRouteChange: true });
            setUsers(users => users.filter(x => x.id !== id));
        });
    }
    function resetUSER(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isUpdating = true; }
            return x;
        }));
        userService.reset(id).then(() => {
            alertService.success('USER HWID RESETED', { keepAfterRouteChange: true });
            setUsers(users.map(x => {
                if (x.id === id) { x.isUpdating = false; }
                return x;      
            }));
        });
    }
    function getdates(unix) {
        const utctime =  Math.floor(Date.now() / 1000);
        const date = new Date(unix * 1000);
        const day = date.getDate(); // 1
        const month = date.getMonth(); // 2 (March is 0-indexed)
        const year = date.getFullYear(); // 2021
        // if (unix > utctime) {
        //     //console.log(unix,">",utctime)
        //     classlayout = 'text-success'
        //     // console.log(unix,">",utctime,classlayout)

        // }else {
        //     classlayout = 'text-danger'
        //     // console.log(unix,"<",utctime,classlayout)
        // }
        return `${day}/${month + 1}/${year}`;
    }

    return (
        <Layout>
            <h1>Users</h1>
            <div className='row'>
                <div className='col'>
                <Link href="/users/add" className="btn btn-sm btn-success mb-2">Add User</Link>

                </div>
                <div className='col'>
                <input type="text" placeholder='Filter' className="form-control mb-2" onChange={(e) => filterBySearchTerm(e.target.value)} />

                </div>
        

            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Username</th>
                        <th style={{ width: '20%' }}>Tool Name</th>
                        <th style={{ width: '30%' }}>Licence</th>
                        <th style={{ width: '20%' }}>Expiry</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData && filteredData.map(user =>
                        <tr key={user.id}>
                            <td>{user.user}</td>
                            <td>{user.name}</td>
                            <td>{user.key}</td>
                            <td>{getdates(user.exp)}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                            <button onClick={() => resetUSER(user.id)} className="btn btn-sm btn-primary mr-1" disabled={user.isDeleting || user.isUpdating}>
                                    {user.isDeleting || user.isUpdating
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Re-set</span>
                                    }
                                </button>
                                <Link href={`/users/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting || user.isUpdating}>
                                    {user.isDeleting || user.isUpdating
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {users && !users.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
