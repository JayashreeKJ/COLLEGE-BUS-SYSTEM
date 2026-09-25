import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import studentService from '../../services/studentService';
import tripService from '../../services/tripService';

// Student Dashboard Components
import StudentWelcomeCard from '../../components/student/StudentWelcomeCard';
import LiveBusLocationCard from '../../components/student/LiveBusLocationCard';
import AssignedBusCard from '../../components/student/AssignedBusCard';
import DriverDetailsCard from '../../components/student/DriverDetailsCard';
import RouteStopsTable from '../../components/student/RouteStopsTable';

// Modals
import PickupStopModal from '../../components/student/modals/PickupStopModal';
import BusDetailModal from '../../components/student/modals/BusDetailModal';
import DriverDetailModal from '../../components/student/modals/DriverDetailModal';
import StopDetailModal from '../../components/student/modals/StopDetailModal';
import StudentProfileModal from '../../components/student/modals/StudentProfileModal';

export default function StudentDashboardPlaceholder() {
  const { user } = useAuth();
  const toast = useToast();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [latestLocation, setLatestLocation] = useState(null);
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState(new Date());

  // Modal Open States
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStopForDetail, setSelectedStopForDetail] = useState(null);

  // Fetch full student profile with assigned route, schedule, and active trip
  const fetchStudentData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await studentService.getMyProfile();
      if (res && res.success && res.data) {
        setStudentData(res.data);
        if (res.data.activeTrip?.latestLocation) {
          setLatestLocation(res.data.activeTrip.latestLocation);
        }
        setError('');
        if (isManual) {
          toast.success('Dashboard and bus data refreshed');
        }
      } else {
        setError(res?.message || 'Failed to load student data');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to connect to SmartBus backend server';
      setError(errorMsg);
      if (isManual) {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setLastRefreshedTime(new Date());
    }
  }, [toast]);

  // Fetch latest location update for the active trip
  const fetchLatestLocation = useCallback(async (tripId) => {
    if (!tripId) return;
    try {
      const res = await tripService.getLatestLocation(tripId);
      if (res && res.success && res.data) {
        setLatestLocation(res.data);
        setLastRefreshedTime(new Date());
      }
    } catch {
      // Ignore background transient network hiccups
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Live GPS Polling Interval
  useEffect(() => {
    if (!isLivePolling || !studentData?.activeTrip?.id) return;

    const interval = setInterval(() => {
      fetchLatestLocation(studentData.activeTrip.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLivePolling, studentData?.activeTrip?.id, fetchLatestLocation]);

  // Toggle Live GPS Polling
  const handleToggleLivePolling = () => {
    const nextState = !isLivePolling;
    setIsLivePolling(nextState);
    if (nextState) {
      toast.info('GPS Auto-Sync resumed (5s intervals)');
      if (studentData?.activeTrip?.id) {
        fetchLatestLocation(studentData.activeTrip.id);
      }
    } else {
      toast.warning('GPS Auto-Sync paused');
    }
  };

  // Direct Stop Selection from Table
  const handleDirectSetPickupStop = async (stopId, stopName) => {
    try {
      const res = await studentService.updatePickupStop(stopId);
      if (res && res.success) {
        toast.success(`Pickup stop changed to ${stopName || res.data.pickupStopName}`);
        setStudentData(res.data);
      } else {
        toast.error(res?.message || 'Failed to update pickup stop');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating pickup stop');
    }
  };

  // Callback when pickup stop or profile is updated via modal
  const handleStudentDataUpdated = (updatedData) => {
    setStudentData(updatedData);
  };

  if (loading) {
    return (
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="status-dot" style={{ width: '20px', height: '20px', backgroundColor: 'var(--primary)', margin: '0 auto 1.25rem' }}></div>
          <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Loading Student Transit Dashboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fetching live GPS telemetry and route schedules...</p>
        </div>
      </div>
    );
  }

  const route = studentData?.assignedRoute;
  const schedule = studentData?.assignedSchedule;
  const trip = studentData?.activeTrip;

  return (
    <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Student Welcome Banner with Pickup Pill & Refresh */}
      <StudentWelcomeCard
        studentData={studentData}
        user={user}
        onOpenPickupModal={() => setIsPickupModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onRefresh={() => fetchStudentData(true)}
        isRefreshing={isRefreshing}
      />

      {/* Error Alert with Retry */}
      {error && (
        <div
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-sm)',
            color: '#fca5a5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <strong>⚠️ Connection Notice:</strong> {error}
          </div>
          <button
            onClick={() => fetchStudentData(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#fca5a5' }}
          >
            🔄 Retry Connection
          </button>
        </div>
      )}

      {/* Main Grid: Live Bus Tracking & Details Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Live Bus Location Card with Simulation and Corridor Track */}
        <LiveBusLocationCard
          trip={trip}
          route={route}
          schedule={schedule}
          currentStopId={studentData?.pickupStopId}
          latestLocation={latestLocation}
          isLivePolling={isLivePolling}
          onToggleLivePolling={handleToggleLivePolling}
          onManualRefresh={() => {
            if (studentData?.activeTrip?.id) {
              fetchLatestLocation(studentData.activeTrip.id);
            }
            fetchStudentData(true);
          }}
          isRefreshing={isRefreshing}
          lastRefreshedTime={lastRefreshedTime}
          onStopClick={(st) => setSelectedStopForDetail(st)}
        />

        {/* Right Column: Assigned Bus & Driver Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AssignedBusCard
            schedule={schedule}
            route={route}
            onOpenBusModal={() => setIsBusModalOpen(true)}
          />

          <DriverDetailsCard
            schedule={schedule}
            trip={trip}
            studentData={studentData}
            onOpenDriverModal={() => setIsDriverModalOpen(true)}
          />
        </div>
      </div>

      {/* Route Stops Sequence Timetable */}
      <RouteStopsTable
        route={route}
        currentStopId={studentData?.pickupStopId}
        currentStopName={studentData?.pickupStopName}
        scheduledDeparture={schedule?.departureTime}
        onSelectStop={(st) => setSelectedStopForDetail(st)}
        onSetPickupStop={handleDirectSetPickupStop}
      />

      {/* Interactive Modals */}
      <PickupStopModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        currentStopId={studentData?.pickupStopId}
        routeStops={route?.stops}
        studentData={studentData}
        onStopUpdated={handleStudentDataUpdated}
      />

      <BusDetailModal
        isOpen={isBusModalOpen}
        onClose={() => setIsBusModalOpen(false)}
        bus={null}
        route={route}
        schedule={schedule}
        trip={trip}
      />

      <DriverDetailModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        driver={null}
        schedule={schedule}
        trip={trip}
        studentEmergencyContact={studentData?.emergencyContact}
      />

      <StopDetailModal
        isOpen={!!selectedStopForDetail}
        onClose={() => setSelectedStopForDetail(null)}
        stop={selectedStopForDetail}
        isCurrentPickup={
          selectedStopForDetail &&
          (selectedStopForDetail.stopId === studentData?.pickupStopId ||
            selectedStopForDetail.id === studentData?.pickupStopId ||
            selectedStopForDetail.stopName === studentData?.pickupStopName)
        }
        scheduledDeparture={schedule?.departureTime}
        studentData={studentData}
        onStopUpdated={handleStudentDataUpdated}
      />

      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        studentData={studentData}
        onProfileUpdated={handleStudentDataUpdated}
      />
    </div>
  );
}
