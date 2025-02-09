class DataController {
    async fetchData(req, res) {
        try {
            const data = await Data.find(); // Assuming Data is imported from the dataModel
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching data', error });
        }
    }
}

export default new DataController();