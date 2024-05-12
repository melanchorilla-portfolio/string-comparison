import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  return (
    <main className="container flex px-10 h-[90vh] justify-center items-center">
      <div className="mx-auto">
        <h1 className="sm:text-xl md:text-2xl font-semibold text-center">
          PERBANDINGAN ALGORITMA JARO-WINKLER DAN LEVENSTHEIN DISTANCE UNTUK
          AUTOCORRECT SPELLING SUGGESTION PADA APLIKASI SPEECH RECOGNITION
        </h1>
        <Button color="dark" className="mx-auto mt-5" onClick={() => setOpenModal(true)}>
          Mulai
        </Button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Mulai</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="leading-relaxed text-gray-500 dark:text-gray-400 text-center text-lg">
                Pilih Metode
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="mx-auto">
            <Button color="light" onClick={() => navigate("/jaro-winkler")}>Jaro Winkler Distance</Button>
            <Button color="light" onClick={() => navigate("/levenshtein")}>
              Levenshtein Distance
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </main>
  );
};

export default Home;
