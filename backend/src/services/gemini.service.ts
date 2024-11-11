import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const result = await this.model.embedContent(text);
    return result.embedding;
  }

  async generateProductDescription(
    name: string,
    category: string
  ): Promise<string> {
    const prompt = `Generate a detailed product description for a ${name} in the ${category} category. 
                   Include key features and benefits.`;
    const result = await this.model.generateText(prompt);
    return result.text;
  }

  async searchProducts(query: string, products: any[]): Promise<any[]> {
    const queryEmbedding = await this.generateEmbeddings(query);

    // Calculate similarity scores for each product
    const productsWithScores = await Promise.all(
      products.map(async (product) => {
        const productEmbedding = await this.generateEmbeddings(
          `${product.name} ${product.description} ${product.category.name}`
        );

        const similarity = this.cosineSimilarity(
          queryEmbedding,
          productEmbedding
        );
        return { ...product, similarity };
      })
    );

    // Sort by similarity score
    return productsWithScores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Return top 10 results
  }

  async generateRecommendations(
    userId: number,
    userHistory: any[],
    allProducts: any[]
  ): Promise<any[]> {
    // Combine user's purchase history and viewed products
    const userProfile = userHistory
      .map((item) => `${item.name} ${item.category.name}`)
      .join(" ");

    const prompt = `Based on a user who has shown interest in: ${userProfile}
                   Generate product recommendations considering these preferences.`;

    const result = await this.model.generateText(prompt);
    const recommendationContext = result.text;

    // Use the AI-generated context to find similar products
    return this.searchProducts(recommendationContext, allProducts);
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (norm1 * norm2);
  }
}
