import React, {useState, useEffect} from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
    const list = localStorage.getItem('list');
    if(list) {
        return JSON.parse(list);
    }
    return [];
};

function App() {
    const [name, setName] = useState('');
    const [list, setList] = useState(getLocalStorage());
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [alert, setAlert] = useState({
        show: false,
        msg: '',
        type: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!name) {
            showAlert(true, 'danger', 'Please, enter value.')
        } else if (name && isEditing) {
            setList(list.map(item => {
                if(item.id === editId) {
                    setIsEditing(false);
                    return {id: editId, title: name};
                } else {
                    return item;
                }
            }))

            showAlert(true, 'success', 'Value changed.')

        } else {
            showAlert(true, 'success', 'Item added to the list')
            const newItem = {id: new Date().getTime().toString(), title: name};
            setList([...list, newItem]);
        }
        setName('')
    };

    const showAlert = (show=false, type='', msg='')=>{
        setAlert({show, type, msg});
    };

    const clearList = () => {
        showAlert(true, 'danger', 'The list is empty');
        setList([]);
    };

    const removeItem = id => {
        showAlert(true, 'danger', 'Item removed')
        const newList = list.filter(item => item.id !== id);
        setList(newList);
    };

    const editItem = id => {
        const specificItem = list.find(item => item.id === id);
        setIsEditing(true);
        setEditId(id);
        setName(specificItem.title);
    };

    useEffect(()=>{
        localStorage.setItem('list', JSON.stringify(list))
    },[list])



    return <section className='section-center'>
        <div
        style={{height: '2.5rem'}}
        >{alert.show && <Alert
            list={list}
            {...alert}
            removeAlert={showAlert}
        />}</div>
        <form className='grocery-form' onSubmit={handleSubmit}>
            <h3>Grocery List</h3>
            <div className="form-control">
                <input
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    type='text'
                    className='grocery'
                    placeholder='e.g. eggs'
                />
                <button className="submit-btn"
                        type='submit'
                >
                    {isEditing ? 'Edit' : 'Submit'}
                </button>
            </div>
        </form>
        { list.length > 0 && <div className="grocery-container">
            <List
                editItem={editItem}
                items={list}
                removeItem={removeItem}
            />
            <button
                onClick={clearList}
                className="clear-btn"
            >Clear Items</button>
        </div>}
    </section>
}

export default App
