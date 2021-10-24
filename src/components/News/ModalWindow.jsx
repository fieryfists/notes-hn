import Modal from "react-modal";
import { useState } from "react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

if (process.env.NODE_ENV !== 'test') Modal.setAppElement("#root");

function ModalWindow({ onSave, searchKey, resultQuery, tagsList, queryId }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  function openModal() {
    setIsOpen(true);
    setTitle("");
  }
  function closeModal() {
    setIsOpen(false);
  }

  function onSaveButton(event) {
    console.log(title, searchKey, resultQuery);

    const newNote = {
      title: title,
      searchKey: searchKey,
      resultQuery: resultQuery
    };

    onSave(newNote);
    closeModal();
    event.preventDefault();
  }

  function onInputChange(event) {
    setTitle(event.target.value);
  }

  return (
    <span>
      <button onClick={() => openModal()}>
        <i className="fa fa-heart" aria-hidden="true"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form className="modalForm" onSubmit={onSaveButton}>
          <input
            type="text"
            value={title}
            onChange={onInputChange}
            placeholder="Query Title"
          />

          <span onClick={closeModal} className="close-button topright">
            &times;
          </span>

          <button type="submit">Save</button>
        </form>
      </Modal>
    </span>
  );
}

export default ModalWindow;
