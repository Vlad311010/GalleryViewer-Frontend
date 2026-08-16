import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import './App.css'
import './styles/variables.css'
import './styles/toastNotifications.css';

import { GallerySelector } from '@comp/GallerySelector/GallerySelector';
import { RoutingWrapper } from "@comp/RoutingWrapper/RoutingWrapper";
import { Group } from "@comp/Group/Group";
import { Gallery } from '@comp/Gallery/Gallery';
import { TagsView } from "@comp/TagsView/TagsView";
import { TagCreation } from "@comp/TagCreation/TagCreation";
import { toast, Toaster } from "react-hot-toast";


function App() {

  return (<>
    <Toaster 
      position="bottom-right"
       containerClassName="WRAPPER"
      
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GallerySelector /> } />
        
        <Route
          path="/gallery/:identifier"
          element={
            <RoutingWrapper<string>
              Component={Gallery}
              parseIdentifier={(id) => id}
            />
          }
        />

        <Route
          path="/gallery/:galleryName/group/:identifier"
          element={
            <RoutingWrapper<number>
              Component={Group}
              parseIdentifier={(id) => parseInt(id)}
            />
          }
        />

        <Route 
          path="/tag/list"
          element={<TagsView />} 
        />

        <Route 
          path="/tag"
          element={<TagCreation />} 
        />


      </Routes>
    </BrowserRouter>

  </>);
}

export default App
