
const DeviceProduct = ({domainPackage: {smsPackageId, smsEntitlementId}}) => {
    return <p>
        <strong>{smsPackageId}</strong> - {smsEntitlementId}
    </p>
}

export default DeviceProduct;