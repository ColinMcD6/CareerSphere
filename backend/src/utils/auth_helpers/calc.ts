export const oneyearfromnow = () => 
    new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
    )

export const weekfromnow = () => 
    new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    )


export const onedaylater = () => 
    new Date(Date.now() + 24 * 60 * 60 * 1000)

export const DAY_LEFT = 24 * 60 * 60 * 1000

export const afteronehour = () => 
    new Date(Date.now() + 60 * 60 * 1000)
