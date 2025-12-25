import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ParkingLot from './pages/ParkingLot';
import Tickets from './pages/Tickets';
import ParkVehicle from './pages/ParkVehicle';
import ExitVehicle from './pages/ExitVehicle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="parking-lot" element={<ParkingLot />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="park" element={<ParkVehicle />} />
          <Route path="exit" element={<ExitVehicle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

