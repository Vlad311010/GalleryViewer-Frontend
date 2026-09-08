import { useAssetMimeType } from "@/contract/media/media";
import { AssetViewImage } from "./AssetViewImage";
import { AssetViewVideo } from "./AssetViewVideo";

export type AssetViewProps = {
  identifier: number;
};

export function AssetView({ identifier }: AssetViewProps) {
    const { data: mimeType, isLoading } = useAssetMimeType(identifier);

    if (isLoading) {
        return <div>Loading</div>;
    }

    if (!mimeType) {
        throw new Error("Undefined mime type");
    }

    let renderElement = null;
    if (mimeType?.startsWith("image/")) {
        renderElement = <AssetViewImage identifier={identifier} />;
    }
    else if (mimeType?.startsWith("video/")) {
        <AssetViewVideo identifier={identifier} />;
        return 
    }

    if (renderElement) {
        return (
        <>
            <title>{identifier}</title>
            {renderElement}
        </>);
    }

    throw new Error("Unknown mime type");
}

export const getViewportSize = () => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
});