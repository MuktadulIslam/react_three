import { MeshyModelVersion, Topology } from "../types";

const baseUrl = 'https://api.meshy.ai/openapi';

export const meshyAPIConfig = {
    // apiKey: process.env.MESHY_API_KEY || 'msy_dummy_api_key_for_test_mode_12345678',
    apiKey: process.env.MESHY_API_KEY || 'msy_P5hZAvmeUPtsFhlz69WMHiIM4Ypdl4odFDtN' || 'msy_dummy_api_key_for_test_mode_12345678',
    aimodel: 'meshy-4' as MeshyModelVersion,
    topology: 'triangle' as Topology,
    target_polycount: 30000,
    endpoints: {
        // Text to 3D uses v2
        textTo3D: `v2/text-to-3d`,
        textGenerated3D: (taskId: string) => `v2/text-to-3d/${taskId}`,

        imageTo3D: `v1/image-to-3d`,
        imageGenerated3D: (taskId: string) => `v1/image-to-3d/${taskId}`,

        // Refine uses v2 text-to-3d endpoint
        refine: `v2/text-to-3d`,
    },
    timeout: 600000, // 10 mins for initial requests
    baseUrl: baseUrl,
};
