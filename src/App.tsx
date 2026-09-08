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
import { AssetDetails } from "@comp/AssetDetails/AssetDetails";
import { EditModeProvider } from "@comp/ViewModeState/ViewModeState";
import { ErrorBoundary } from 'react-error-boundary'
import { AppErrorFallback } from '@comp/AppErrorFallback/AppErrorFallback';
import { AssetView } from "@comp/AssetView/AssetView";

function App() {

  return (<>
    <Toaster 
      position="bottom-right"
    />
    
    <BrowserRouter>
      <SearchQueryState>
        <ErrorBoundary FallbackComponent={AppErrorFallback}>
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
                path="/tags/list"
                element={<TagsView />} 
              />

              <Route 
                path="/tags"
                element={<TagCreation />} 
              />
              
            </Routes>
          </EditModeProvider>
        </ErrorBoundary>
      </SearchQueryState>
    </BrowserRouter>

  </>);
}

export default App
