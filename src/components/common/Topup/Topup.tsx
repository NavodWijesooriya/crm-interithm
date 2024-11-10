import { useRef } from 'react';

const ModalComponent = () => {
  // Create a reference for the dialog element
  const modalRef = useRef(null);

  // Function to open the modal
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      modalRef.current.close();
    }
  };
  
  // Attach this as an `onClick` handler for the `<dialog>` element:
  <dialog ref={modalRef} className="modal" onClick={handleBackdropClick}>
  

  return (
    <div>
      {/* Button to open the modal */}
      <button className="btn" onClick={openModal}>Open Modal</button>

      {/* Dialog element */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            {/* Button to close the modal */}
            <button className="btn" onClick={() => modalRef.current.close()}>Close</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

  

export default ModalComponent;


