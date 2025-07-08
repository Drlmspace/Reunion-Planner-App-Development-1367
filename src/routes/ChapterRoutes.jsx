import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VisionChapter from '../pages/Chapters/VisionChapter';
import CommitteeChapter from '../pages/Chapters/CommitteeChapter';
import DateBudgetChapter from '../pages/Chapters/DateBudgetChapter';
import VenueChapter from '../pages/Chapters/VenueChapter';
import ProgramChapter from '../pages/Chapters/ProgramChapter';
import CommunicationChapter from '../pages/Chapters/CommunicationChapter';
import RSVPChapter from '../pages/Chapters/RSVPChapter';
import TravelChapter from '../pages/Chapters/TravelChapter';
import FoodChapter from '../pages/Chapters/FoodChapter';
import VendorChapter from '../pages/Chapters/VendorChapter';
import ContingencyChapter from '../pages/Chapters/ContingencyChapter';
import DebriefChapter from '../pages/Chapters/DebriefChapter';

const ChapterRoutes = () => {
  return (
    <Routes>
      <Route path="vision" element={<VisionChapter />} />
      <Route path="committee" element={<CommitteeChapter />} />
      <Route path="date-budget" element={<DateBudgetChapter />} />
      <Route path="venue" element={<VenueChapter />} />
      <Route path="program" element={<ProgramChapter />} />
      <Route path="communication" element={<CommunicationChapter />} />
      <Route path="rsvp" element={<RSVPChapter />} />
      <Route path="travel" element={<TravelChapter />} />
      <Route path="food" element={<FoodChapter />} />
      <Route path="vendors" element={<VendorChapter />} />
      <Route path="contingency" element={<ContingencyChapter />} />
      <Route path="debrief" element={<DebriefChapter />} />
    </Routes>
  );
};

export default ChapterRoutes;