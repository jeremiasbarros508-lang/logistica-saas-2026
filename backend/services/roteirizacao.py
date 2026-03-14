import math
from typing import List, Tuple, Dict
from itertools import combinations

class Entrega:
    def __init__(self, id: int, endereco: str, lat: float, lng: float, prioridade: int = 0):
        self.id = id
        self.endereco = endereco
        self.lat = lat
        self.lng = lng
        self.prioridade = prioridade

class RoteirizacaoService:
    
    @staticmethod
    def calcular_distancia(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calcula distância euclidiana entre dois pontos (aproximado)"""
        return math.sqrt((lat2 - lat1)**2 + (lng2 - lng1)**2)
    
    @staticmethod
    def nearest_neighbor(ponto_origem: Tuple[float, float], entregas: List[Entrega]) -> List[Entrega]:
        """
        Algoritmo Nearest Neighbor para roteirização inicial
        Começa no ponto de origem e vai para a entrega mais próxima não visitada
        """
        nao_visitadas = entregas.copy()
        rota = []
        posicao_atual = ponto_origem
        
        while nao_visitadas:
            # Ordena por prioridade (maior prioridade primeiro) e depois por distância
            nao_visitadas.sort(
                key=lambda e: (-e.prioridade, RoteirizacaoService.calcular_distancia(
                    posicao_atual[0], posicao_atual[1], e.lat, e.lng
                ))
            )
            
            proxima_entrega = nao_visitadas.pop(0)
            rota.append(proxima_entrega)
            posicao_atual = (proxima_entrega.lat, proxima_entrega.lng)
        
        return rota
    
    @staticmethod
    def calcular_distancia_total(ponto_origem: Tuple[float, float], rota: List[Entrega]) -> float:
        """Calcula a distância total da rota"""
        distancia = 0
        posicao_atual = ponto_origem
        
        for entrega in rota:
            distancia += RoteirizacaoService.calcular_distancia(
                posicao_atual[0], posicao_atual[1], entrega.lat, entrega.lng
            )
            posicao_atual = (entrega.lat, entrega.lng)
        
        return distancia
    
    @staticmethod
    def dois_opt(ponto_origem: Tuple[float, float], rota: List[Entrega], max_iteracoes: int = 100) -> List[Entrega]:
        """
        Algoritmo 2-Opt para otimizar rota
        Inverte segmentos da rota para reduzir distância total
        """
        melhor_rota = rota.copy()
        melhorou = True
        iteracoes = 0
        
        while melhorou and iteracoes < max_iteracoes:
            melhorou = False
            iteracoes += 1
            distancia_atual = RoteirizacaoService.calcular_distancia_total(ponto_origem, melhor_rota)
            
            # Testa todas as combinações de dois segmentos
            for i in range(len(melhor_rota) - 1):
                for k in range(i + 2, len(melhor_rota)):
                    # Cria nova rota invertendo o segmento entre i e k
                    nova_rota = melhor_rota[:i+1] + melhor_rota[i+1:k+1][::-1] + melhor_rota[k+1:]
                    nova_distancia = RoteirizacaoService.calcular_distancia_total(ponto_origem, nova_rota)
                    
                    if nova_distancia < distancia_atual:
                        melhor_rota = nova_rota
                        distancia_atual = nova_distancia
                        melhorou = True
                        break
                
                if melhorou:
                    break
        
        return melhor_rota
    
    @staticmethod
    def gerar_rota_otimizada(ponto_origem: Tuple[float, float], entregas: List[Entrega]) -> Dict:
        """
        Gera rota otimizada usando Nearest Neighbor + 2-Opt
        """
        # Etapa 1: Aplicar Nearest Neighbor
        rota_inicial = RoteirizacaoService.nearest_neighbor(ponto_origem, entregas)
        distancia_inicial = RoteirizacaoService.calcular_distancia_total(ponto_origem, rota_inicial)
        
        # Etapa 2: Otimizar com 2-Opt
        rota_otimizada = RoteirizacaoService.dois_opt(ponto_origem, rota_inicial)
        distancia_otimizada = RoteirizacaoService.calcular_distancia_total(ponto_origem, rota_otimizada)
        
        # Criar resultado com numeração de paradas
        paradas = []
        for idx, entrega in enumerate(rota_otimizada, 1):
            paradas.append({
                'numero_parada': idx,
                'entrega_id': entrega.id,
                'endereco': entrega.endereco,
                'latitude': entrega.lat,
                'longitude': entrega.lng,
                'prioridade': entrega.prioridade
            })
        
        return {
            'paradas': paradas,
            'distancia_inicial_km': round(distancia_inicial * 111, 2),
            'distancia_otimizada_km': round(distancia_otimizada * 111, 2),
            'economia_km': round((distancia_inicial - distancia_otimizada) * 111, 2),
            'economia_percentual': round(((distancia_inicial - distancia_otimizada) / distancia_inicial * 100), 2),
            'total_paradas': len(paradas)
        }