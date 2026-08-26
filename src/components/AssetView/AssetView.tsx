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

    if (mimeType?.startsWith("image/")) {
        return <AssetViewImage identifier={identifier} />;
    }

    if (mimeType?.startsWith("video/")) {
        return <AssetViewVideo identifier={identifier} />;
    }

    throw new Error("Unknown mime type");
}

export const getViewportSize = () => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
});