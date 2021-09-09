
const imageJsonUrl = 'https://jsonkeeper.com/b/1X9B'


export const localData = {
    countries: undefined
};

export const loadData = () => {
    return new Promise((resolve, reject) => {
        fetch(imageJsonUrl)
            .then((response: Response) => response.json())
            .then((remoteData: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                localData.countries = remoteData
                resolve(remoteData)
            })
            .catch(reject)
    })
  }