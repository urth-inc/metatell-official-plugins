
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/CustomOverlay';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/CustomOverlay' ? typeof import('REMOTE_ALIAS_IDENTIFIER/CustomOverlay') :any;