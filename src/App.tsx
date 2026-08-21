import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import './styles/variables.css'
import './styles/toastNotifications.css';

import { GallerySelector } from '@comp/GallerySelector/GallerySelector';
import { RoutingWrapper } from "@comp/RoutingWrapper/RoutingWrapper";
import { Group } from "@comp/Group/Group";
import { Gallery } from '@comp/Gallery/Gallery';
import { TagsView } from "@comp/TagsView/TagsView";
import { TagCreation } from "@comp/TagCreation/TagCreation";
import { Toaster } from "react-hot-toast";
import { SearchQueryState } from "@comp/SearchQueryState/SearchQueryState";
import { AssetDetails } from "@/components/AssetDetails/AssetDetails";
import { EditModeProvider } from "@comp/ViewModeState/ViewModeState";
import { AssetView } from "./components/AssetView/AssetView";


function App() {

  return (<>
    <Toaster 
      position="bottom-right"
    />
    
    <BrowserRouter>
      <SearchQueryState>
        <EditModeProvider>
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
              path="/gallery/:galleryName/asset/:identifier"
              element={
                <RoutingWrapper<number>
                  Component={AssetDetails}
                  parseIdentifier={(id) => parseInt(id)}
                />
              }
            />

            <Route
              path="/gallery/:galleryName/asset/:identifier/view"
              element={
                <RoutingWrapper<number>
                  Component={AssetView}
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
        </EditModeProvider>
      </SearchQueryState>
    </BrowserRouter>

  </>);
}

export default App
