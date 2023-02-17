import './deletemodal.css'


const DeleteModal = ({ action, items, handleCloseMessage, handleAction }) => {

    return (

        <div className={action ? 'delete-modal-active': 'delete-modal-inactive'}>
            <div className="delete-modal" >
                <img id="delete-img" src="https://100dayscss.com/codepen/alert.png" width="44" height="38" alt='warning' />
                <span className="action-title">Are you sure want to detele this record?</span>
                <p className='delete-message'>This item will be deleted immediately from your database.<br/>You can't undo this action</p>

                <div className='a-buttons'>
                    <button type='button' className="dismiss-button" onClick={() => handleCloseMessage()}>Cancel</button>
                    <button type='button' className="delete-button" onClick={() => handleAction()}>Delete </button>
                </div>

            </div>
        </div>

    )
}

export default DeleteModal